import { passkeyClient } from '@better-auth/passkey/client';
import { organizationSlug } from '@sprintstack/shared';
import { emailOTPClient, organizationClient, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/**
 * Talks to /api/auth on this origin, which next.config.ts rewrites to the API. Cookies stay
 * first-party and passkeys are bound to this domain.
 */
export const authClient = createAuthClient({
  plugins: [twoFactorClient(), passkeyClient(), emailOTPClient(), organizationClient()],
});

/** Where people land once signed in. There's no workspace screen yet, so it's the home page. */
const AFTER_SIGN_IN = '/dashboard';

const PENDING_INVITATION = 'sprintstack:invitation';

/**
 * Keeps an invite opened while signed out (or as someone else) for this tab, so finishing sign-in
 * or sign-up comes back to it. Null forgets it once it's accepted, declined or gone.
 */
export const rememberInvitation = (id: string | null) => {
  try {
    if (id) sessionStorage.setItem(PENDING_INVITATION, id);
    else sessionStorage.removeItem(PENDING_INVITATION);
  } catch {
    // Storage blocked; the person can open the invite link again.
  }
};

const pendingInvitation = () => {
  try {
    return sessionStorage.getItem(PENDING_INVITATION);
  } catch {
    return null;
  }
};

/** Whether this tab arrived from an invite, so sign-up joins that organization. */
export const hasPendingInvitation = () => Boolean(pendingInvitation());

/** Where to go once signed in: back to a pending invite, otherwise AFTER_SIGN_IN. */
export const afterSignIn = () => {
  const id = pendingInvitation();
  return id ? `/invitations/${encodeURIComponent(id)}` : AFTER_SIGN_IN;
};

/**
 * Creates an organization owned by the signed-in person and makes it active. When the plain slug
 * is taken, tries once more with a random suffix.
 */
export const createOrganization = async (name: string) => {
  const result = await authClient.organization.create({ name, slug: organizationSlug(name) });
  if (result.error?.code !== 'ORGANIZATION_ALREADY_EXISTS') return result;
  return authClient.organization.create({ name, slug: organizationSlug(name, true) });
};

/** Better Auth's error message, or a fallback that says what to do. */
export const errorMessage = (error: { message?: string } | null | undefined, fallback: string) =>
  error?.message || fallback;

/** GitHub sign-in and sign-up: new accounts continue to the Secure step of sign-up. */
export const signInWithGitHub = () =>
  authClient.signIn.social({
    provider: 'github',
    callbackURL: afterSignIn(),
    newUserCallbackURL: '/signup/secure',
    errorCallbackURL: '/signin',
  });
