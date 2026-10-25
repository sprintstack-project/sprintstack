import { expoClient } from '@better-auth/expo/client';
import { twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

/**
 * The same public auth origin as the web app (it proxies /api/auth to the API), so GitHub's
 * callback URL and passkey domain match on every platform. On a device, point it at a URL the
 * device can reach (LAN IP or tunnel) and set BETTER_AUTH_URL in apps/api to match.
 */
export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_AUTH_URL ?? 'http://localhost:3001',
  plugins: [
    expoClient({
      // Keep in step with "scheme" in app.json and APP_SCHEME in apps/api.
      scheme: 'sprintstack',
      storagePrefix: 'sprintstack',
      storage: SecureStore,
    }),
    twoFactorClient(),
  ],
});
