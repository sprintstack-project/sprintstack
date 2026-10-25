import { Client, fetchExchange, mapExchange } from '@urql/core';
import { createCache } from './cache';

export interface ApiClientOptions {
  /** The GraphQL endpoint: `/api/graphql` on web (rewritten to the API), the API's URL on native. */
  url: string;
  /** A fetch that adds credentials. Web sends its first-party cookies by itself; native adds them. */
  fetch?: typeof fetch;
  /** Called when the API rejects the session, e.g. to sign out and show the sign-in screen. */
  onUnauthenticated?: () => void;
  /**
   * Set during Next's server render. The server has no session cookie to send, so queries stay
   * loading there and the browser fetches them after hydration.
   */
  serverRender?: boolean;
}

export const createApiClient = ({
  url,
  fetch,
  onUnauthenticated,
  serverRender,
}: ApiClientOptions) => {
  return new Client({
    url,
    fetch,
    // POST with a JSON body for queries too: the API's CSRF protection blocks plain GETs.
    preferGetMethod: false,
    exchanges: [
      mapExchange({
        onError(error) {
          const unauthenticated =
            error.response?.status === 401 ||
            error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
          if (unauthenticated) onUnauthenticated?.();
        },
      }),
      createCache(),
      ...(serverRender ? [] : [fetchExchange]),
    ],
  });
};
