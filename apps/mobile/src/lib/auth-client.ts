import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';
import { hostUrl } from './host-url';

/**
 * The same public auth origin as the web app (it proxies /api/auth to the API), so GitHub's
 * callback URL and passkey domain match on every platform. On a device, point it at a URL the
 * device can reach (LAN IP or tunnel) and set BETTER_AUTH_URL in apps/api to match.
 */
export const AUTH_URL = hostUrl(process.env.EXPO_PUBLIC_AUTH_URL ?? 'http://localhost:3001');

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
  plugins: [
    expoClient({
      // Keep in step with "scheme" in app.json and APP_SCHEME in apps/api.
      scheme: 'sprintstack',
      storagePrefix: 'sprintstack',
      storage: SecureStore,
    }),
    twoFactorClient(),
    emailOTPClient(),
  ],
});

/** Better Auth's error message, or a fallback that says what to do. */
export const errorMessage = (error: { message?: string } | null | undefined, fallback: string) =>
  error?.message || fallback;

/**
 * Re-reads the session into useSession()'s store. Await it after signing in or up, before
 * navigating: the store keeps its last value ("signed out") and only refetches a tick after the
 * next screen subscribes, so that screen's session guard would otherwise bounce the person away.
 */
export const refreshSession = () => authClient.$store.atoms.session.get().refetch();
