import { Client, type Exchange, fetchExchange, mapExchange } from '@urql/core';
import { filter, pipe } from 'wonka';
import { createCache } from './cache';
import { isUnauthenticated } from './errors';

/**
 * The server render's only exchange: it drops every operation, so queries stay loading. Running
 * the real exchanges there would be wasted work, and in development urql stamps each exchange's
 * debug events with `Date.now()`, which Next's prerender (cacheComponents) rejects.
 */
const serverExchange: Exchange =
  ({ forward }) =>
  (operations$) =>
    forward(
      pipe(
        operations$,
        filter(() => false),
      ),
    );

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
    exchanges: serverRender
      ? [serverExchange]
      : [
          mapExchange({
            onError(error) {
              if (isUnauthenticated(error)) onUnauthenticated?.();
            },
          }),
          createCache(),
          fetchExchange,
        ],
  });
};
