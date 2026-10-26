import { expo } from '@better-auth/expo';
import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { captcha } from 'better-auth/plugins/captcha';
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

  // Turnstile guards the web's email sign-up, sign-in and password-reset requests (Better Auth's
  // default captcha endpoints). Tokens must come from the widget on an allowed web hostname.
  const turnstileHostnames = list(env('TURNSTILE_HOSTNAMES'));
  const turnstile = captcha({
    provider: 'cloudflare-turnstile',
    secretKey: required(env, 'TURNSTILE_SECRET'),
    // Keep in step with TURNSTILE_ACTION in apps/web.
    expectedAction: 'auth',
    allowedHostnames: turnstileHostnames.length
      ? turnstileHostnames
      : [new URL(webOrigin).hostname],
  });
  // The native app has no widget, so in development its requests skip the check. Production
  // enforces it for everyone: the app's origin is only a header that any script can send, and the
  // app isn't released, so email sign-in and sign-up there work against a development API only.
  const isNativeApp = (request: Request) => {
    const origin = request.headers.get('expo-origin') ?? request.headers.get('origin') ?? '';
    return origin.startsWith(`${appScheme}://`) || origin.startsWith('exp://');
  };

  const githubClientId = env('GITHUB_CLIENT_ID');
  const githubClientSecret = env('GITHUB_CLIENT_SECRET');

  return betterAuth({
    appName: APP_NAME,
    baseURL,
    secret: required(env, 'BETTER_AUTH_SECRET'),
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    // Email-code routes the apps don't use. They'd send mail with no Turnstile check (sign-in codes
    // even to addresses without an account), so they're switched off rather than left open.
    disabledPaths: [
      '/sign-in/email-otp',
      '/email-otp/request-password-reset',
      '/forget-password/email-otp',
      '/email-otp/reset-password',
    ],
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
    // The rate limiter keys on the client IP. Cloudflare sets cf-connecting-ip to the visitor's
    // address (the web app's rewrite passes it through); the default x-forwarded-for arrives as a
    // proxy chain, which Better Auth won't trust. Only safe while the origin is reachable solely
    // through Cloudflare, otherwise clients can spoof the header.
    advanced: {
      ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] },
    },
    plugins: [
      expo(),
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        // Codes go only to existing accounts; signing up happens through /sign-up/email.
        disableSignUp: true,
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
      {
        ...turnstile,
        onRequest: async (request, ctx) =>
          isDev && isNativeApp(request) ? undefined : turnstile.onRequest(request, ctx),
      },
    ],
  });
};

export type Auth = ReturnType<typeof createAuth>;
