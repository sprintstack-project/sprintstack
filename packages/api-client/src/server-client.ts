// The client for Server Components. Nothing here imports React or urql's React bindings, which
// can't load on the server.
import { Client, fetchExchange } from '@urql/core';

/**
 * Sends `headers` (the visitor's cookie) with every request. No cache: a client lives for one
 * request, and the browser's urql cache is separate.
 */
export const createServerApiClient = ({
  url,
  headers,
}: {
  url: string;
  headers: Record<string, string>;
}) =>
  new Client({
    url,
    preferGetMethod: false,
    fetchOptions: { headers, cache: 'no-store' },
    exchanges: [fetchExchange],
  });
