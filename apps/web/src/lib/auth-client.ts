import { passkeyClient } from '@better-auth/passkey/client';
import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

/**
 * Talks to /api/auth on this origin, which next.config.ts rewrites to the API. Cookies stay
 * first-party and passkeys are bound to this domain.
 */
export const authClient = createAuthClient({
  plugins: [twoFactorClient(), passkeyClient()],
});
