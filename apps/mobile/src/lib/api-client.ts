import { createApiClient } from '@sprintstack/api-client';
import { authClient } from './auth-client';

/**
 * Talks to the API directly. Native fetch has no cookie jar for it, so each request carries the
 * session cookie that expoClient keeps in SecureStore.
 */
export const apiClient = createApiClient({
  url: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql',
  fetch: async (input, init) => {
    const headers = new Headers(init?.headers);
    const cookie = await authClient.getCookie();
    if (cookie) headers.set('Cookie', cookie);
    // 'include' could send other cookies alongside the one set by hand.
    return fetch(input, { ...init, headers, credentials: 'omit' });
  },
  // Clears the stored session, so useSession() reports signed out.
  onUnauthenticated: () => authClient.signOut(),
});
