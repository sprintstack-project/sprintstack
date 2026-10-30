import type { AuthContext, GenericEndpointContext } from '@better-auth/core';
import {
  type AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  type RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type { BetterAuthPlugin } from 'better-auth';
import { APIError, createAuthEndpoint, sessionMiddleware } from 'better-auth/api';
import { setSessionCookie } from 'better-auth/cookies';
import { generateRandomString } from 'better-auth/crypto';
import * as z from 'zod';

// Android Restore Credentials (Google Play's zero-tap sign-in restoration). The app creates a
// restore key, a passkey-style credential that Credential Manager backs up with the device, and
// reads it silently on a new device to sign back in. Keys live apart from passkeys so they never
// show in a passkey list, and each belongs to the session that registered it: signing out,
// revoking sessions or an expired session ends the key too.

export type RestoreKeyOptions = {
  rpName: string;
  /** The passkey RP ID, a domain whose assetlinks.json lists the app (get_login_creds). */
  rpID: string;
  /** Expected client origins; the Android app reports android:apk-key-hash:<hash>. */
  origin: string[];
};

type RestoreKey = {
  id: string;
  userId: string;
  sessionId: string;
  credentialID: string;
  publicKey: string;
  counter: number;
  createdAt: Date;
};

type Challenge =
  | { type: 'registration'; challenge: string; sessionId: string }
  | { type: 'authentication'; challenge: string };

export const RESTORE_KEY_NOT_FOUND = 'RESTORE_KEY_NOT_FOUND';

const CHALLENGE_COOKIE = 'restore_key_challenge';
const CHALLENGE_MAX_AGE = 5 * 60;

// The parts of an endpoint context the challenge helpers use. GenericEndpointContext itself won't
// accept an endpoint's context (its getPlugin types don't line up).
type ChallengeContext = Pick<GenericEndpointContext, 'getSignedCookie' | 'setSignedCookie'> & {
  context: Pick<AuthContext, 'createAuthCookie' | 'internalAdapter' | 'secret'>;
};

const responseBody = z.object({ response: z.record(z.string(), z.any()) });

const invalidChallenge = () =>
  new APIError('BAD_REQUEST', {
    code: 'RESTORE_KEY_CHALLENGE_NOT_FOUND',
    message: 'The restore challenge expired. Try again.',
  });

const notFound = () =>
  new APIError('UNAUTHORIZED', {
    code: RESTORE_KEY_NOT_FOUND,
    message: 'This restore key is no longer valid.',
  });

export const restoreKey = (options: RestoreKeyOptions) => {
  // Same scheme as @better-auth/passkey: a signed cookie names a verification row holding the
  // challenge, which the verify step consumes once.
  const saveChallenge = async (ctx: ChallengeContext, value: Challenge) => {
    const token = generateRandomString(32);
    const cookie = ctx.context.createAuthCookie(CHALLENGE_COOKIE);
    await ctx.setSignedCookie(cookie.name, token, ctx.context.secret, {
      ...cookie.attributes,
      maxAge: CHALLENGE_MAX_AGE,
    });
    await ctx.context.internalAdapter.createVerificationValue({
      identifier: token,
      value: JSON.stringify(value),
      expiresAt: new Date(Date.now() + CHALLENGE_MAX_AGE * 1000),
    });
  };

  const consumeChallenge = async (ctx: ChallengeContext) => {
    const cookie = ctx.context.createAuthCookie(CHALLENGE_COOKIE);
    const token = await ctx.getSignedCookie(cookie.name, ctx.context.secret);
    if (!token) throw invalidChallenge();
    const row = await ctx.context.internalAdapter.consumeVerificationValue(token);
    if (!row) throw invalidChallenge();
    return JSON.parse(row.value) as Challenge;
  };

  return {
    id: 'restore-key',
    schema: {
      restoreKey: {
        fields: {
          userId: {
            type: 'string',
            required: true,
            references: { model: 'user', field: 'id', onDelete: 'cascade' },
            index: true,
          },
          sessionId: {
            type: 'string',
            required: true,
            references: { model: 'session', field: 'id', onDelete: 'cascade' },
            // One key per session: Credential Manager keeps one per app on a device.
            unique: true,
          },
          credentialID: { type: 'string', required: true, unique: true },
          publicKey: { type: 'string', required: true },
          counter: { type: 'number', required: true },
          createdAt: { type: 'date', required: true },
        },
      },
    },
    endpoints: {
      generateRestoreKeyRegisterOptions: createAuthEndpoint(
        '/restore-key/generate-register-options',
        { method: 'GET', use: [sessionMiddleware] },
        async (ctx) => {
          const { user, session } = ctx.context.session;
          const registration = await generateRegistrationOptions({
            rpName: options.rpName,
            rpID: options.rpID,
            userName: user.email,
            userDisplayName: user.name,
            attestationType: 'none',
            // Restore keys are read without any UI, so they can't ask for user verification.
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              residentKey: 'required',
              userVerification: 'discouraged',
            },
          });
          await saveChallenge(ctx, {
            type: 'registration',
            challenge: registration.challenge,
            sessionId: session.id,
          });
          return ctx.json(registration);
        },
      ),

      verifyRestoreKeyRegistration: createAuthEndpoint(
        '/restore-key/verify-registration',
        { method: 'POST', use: [sessionMiddleware], body: responseBody },
        async (ctx) => {
          const { user, session } = ctx.context.session;
          const challenge = await consumeChallenge(ctx);
          if (challenge.type !== 'registration' || challenge.sessionId !== session.id) {
            throw invalidChallenge();
          }
          const { verified, registrationInfo } = await verifyRegistrationResponse({
            response: ctx.body.response as RegistrationResponseJSON,
            expectedChallenge: challenge.challenge,
            expectedOrigin: options.origin,
            expectedRPID: options.rpID,
            requireUserVerification: false,
          }).catch((cause) => {
            // Usually an origin missing from PASSKEY_ORIGINS (android:apk-key-hash:<hash>).
            ctx.context.logger.error('Restore key registration failed', cause);
            return { verified: false, registrationInfo: undefined };
          });
          if (!verified || !registrationInfo) {
            throw new APIError('BAD_REQUEST', {
              message: 'The restore key could not be verified.',
            });
          }
          // A new key replaces the one this session made before; Credential Manager keeps only one.
          await ctx.context.adapter.deleteMany({
            model: 'restoreKey',
            where: [{ field: 'sessionId', value: session.id }],
          });
          await ctx.context.adapter.create<Omit<RestoreKey, 'id'>>({
            model: 'restoreKey',
            data: {
              userId: user.id,
              sessionId: session.id,
              credentialID: registrationInfo.credential.id,
              publicKey: Buffer.from(registrationInfo.credential.publicKey).toString('base64url'),
              counter: registrationInfo.credential.counter,
              createdAt: new Date(),
            },
          });
          return ctx.json({ status: true });
        },
      ),

      generateRestoreKeyAuthenticateOptions: createAuthEndpoint(
        '/restore-key/generate-authenticate-options',
        { method: 'GET' },
        async (ctx) => {
          const authentication = await generateAuthenticationOptions({
            rpID: options.rpID,
            userVerification: 'discouraged',
          });
          await saveChallenge(ctx, { type: 'authentication', challenge: authentication.challenge });
          return ctx.json(authentication);
        },
      ),

      verifyRestoreKeyAuthentication: createAuthEndpoint(
        '/restore-key/verify-authentication',
        { method: 'POST', body: responseBody },
        async (ctx) => {
          const challenge = await consumeChallenge(ctx);
          if (challenge.type !== 'authentication') throw invalidChallenge();
          const credentialID = ctx.body.response.id;
          if (typeof credentialID !== 'string') throw notFound();

          const key = await ctx.context.adapter.findOne<RestoreKey>({
            model: 'restoreKey',
            where: [{ field: 'credentialID', value: credentialID }],
          });
          if (!key) throw notFound();
          // The old device must still be signed in. Expired sessions linger until Better Auth
          // next reads them, so the cascade alone doesn't cover them.
          const oldSession = await ctx.context.adapter.findOne<{ expiresAt: Date }>({
            model: 'session',
            where: [{ field: 'id', value: key.sessionId }],
          });
          if (!oldSession || new Date(oldSession.expiresAt) < new Date()) throw notFound();

          const { verified } = await verifyAuthenticationResponse({
            response: ctx.body.response as AuthenticationResponseJSON,
            expectedChallenge: challenge.challenge,
            expectedOrigin: options.origin,
            expectedRPID: options.rpID,
            credential: {
              id: key.credentialID,
              publicKey: Buffer.from(key.publicKey, 'base64url'),
              counter: key.counter,
            },
            requireUserVerification: false,
          }).catch((cause) => {
            ctx.context.logger.error('Restore key authentication failed', cause);
            return { verified: false };
          });
          if (!verified) throw notFound();

          // One use per key: the new device registers its own once it's signed in. No second
          // factor, as Google advises; the device transfer already proves possession.
          await ctx.context.adapter.delete({
            model: 'restoreKey',
            where: [{ field: 'id', value: key.id }],
          });
          const user = await ctx.context.internalAdapter.findUserById(key.userId);
          if (!user) throw notFound();
          const session = await ctx.context.internalAdapter.createSession(user.id);
          if (!session) {
            throw new APIError('INTERNAL_SERVER_ERROR', { message: 'Couldn’t start a session.' });
          }
          await setSessionCookie(ctx, { session, user });
          return ctx.json({ session, user });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};
