import { passkeyClient } from '@better-auth/passkey/client';
import { emailOTPClient, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/**
 * Talks to /api/auth on this origin, which next.config.ts rewrites to the API. Cookies stay
 * first-party and passkeys are bound to this domain.
 */
export const authClient = createAuthClient({
  plugins: [twoFactorClient(), passkeyClient(), emailOTPClient()],
});

/** Where people land once signed in. There's no workspace screen yet, so it's the home page. */
export const AFTER_SIGN_IN = '/dashboard';

/** Better Auth's error message, or a fallback that says what to do. */
export const errorMessage = (error: { message?: string } | null | undefined, fallback: string) =>
  error?.message || fallback;

/** GitHub sign-in and sign-up: new accounts continue to the Secure step of sign-up. */
export const signInWithGitHub = () =>
  authClient.signIn.social({
    provider: 'github',
    callbackURL: AFTER_SIGN_IN,
    newUserCallbackURL: '/signup/secure',
    errorCallbackURL: '/signin',
  });
