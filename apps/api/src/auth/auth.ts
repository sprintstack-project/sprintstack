import { expo } from '@better-auth/expo';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { haveIBeenPwned } from 'better-auth/plugins/haveibeenpwned';
import { twoFactor } from 'better-auth/plugins/two-factor';
import type { PrismaClient } from '../generated/prisma/client';
import { sendAuthEmail } from './mailer';

export const APP_NAME = 'SprintStack';

/** Reads a variable; ConfigService.get in the app, process.env in the CLI entry. */
export type EnvReader = (key: string) => string | undefined;

const list = (value: string | undefined) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const required = (env: EnvReader, key: string) => {
  const value = env(key);
  if (!value) throw new Error(`${key} is not set`);
  return value;
};

export const createAuth = (prisma: PrismaClient, env: EnvReader) => {
  // The public origin that serves /api/auth. The web app proxies that path here, so in a browser
  // auth cookies are first-party on the web origin and passkeys are bound to its domain.
  const baseURL = required(env, 'BETTER_AUTH_URL');
  const webOrigin = env('WEB_ORIGIN') ?? baseURL;
  const appScheme = env('APP_SCHEME') ?? 'sprintstack';
  const isDev = env('NODE_ENV') !== 'production';

  const githubClientId = env('GITHUB_CLIENT_ID');
  const githubClientSecret = env('GITHUB_CLIENT_SECRET');

  return betterAuth({
    appName: APP_NAME,
    baseURL,
    secret: required(env, 'BETTER_AUTH_SECRET'),
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    trustedOrigins: [
      webOrigin,
      `${appScheme}://`,
      // Expo Go and dev clients use exp:// URLs on the LAN.
      ...(isDev ? ['exp://', 'exp://**'] : []),
      ...list(env('TRUSTED_ORIGINS')),
    ],
    emailAndPassword: {
      enabled: true,
      // Keep in step with PASSWORD_MIN_LENGTH in packages/shared.
      minPasswordLength: 12,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 30 * 60,
      sendResetPassword: async ({ user, url }) => {
        void sendAuthEmail({
          to: user.email,
          subject: `Reset your ${APP_NAME} password`,
          text: `Choose a new password: ${url}\n\nThe link expires in 30 minutes. If you didn't ask for this, ignore this email.`,
        });
      },
    },
    // Sign-up sends the code; users stay signed in while they verify (the Verify step).
    emailVerification: { sendOnSignUp: true },
    socialProviders:
      githubClientId && githubClientSecret
        ? { github: { clientId: githubClientId, clientSecret: githubClientSecret } }
        : {},
    account: {
      accountLinking: { enabled: true, trustedProviders: ['github'] },
    },
    plugins: [
      expo(),
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        // Email verification uses this 6-digit code instead of a link.
        overrideDefaultEmailVerification: true,
        sendVerificationOTP: async ({ email, otp }) => {
          void sendAuthEmail({
            to: email,
            subject: `${otp} is your ${APP_NAME} code`,
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
          });
        },
      }),
      // Rejects passwords found in known breaches. Only a 5-character hash prefix leaves the
      // server (k-anonymity), but sign-up fails if api.pwnedpasswords.com can't be reached.
      haveIBeenPwned({
        customPasswordCompromisedMessage:
          'This password has appeared in a data breach. Choose a different one.',
      }),
      twoFactor({
        issuer: APP_NAME,
        // GitHub- and passkey-only accounts have no password to confirm with.
        allowPasswordless: true,
      }),
      passkey({
        rpName: APP_NAME,
        rpID: env('PASSKEY_RP_ID') ?? new URL(webOrigin).hostname,
        // Browsers report the web origin. Native apps report https://<rpID> (iOS) or
        // android:apk-key-hash:<hash> (Android), so those come from PASSKEY_ORIGINS.
        origin: [webOrigin, ...list(env('PASSKEY_ORIGINS'))],
      }),
    ],
  });
};

export type Auth = ReturnType<typeof createAuth>;
