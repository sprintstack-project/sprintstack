import 'server-only';

import { isUnauthenticated } from '@sprintstack/api-client/errors';
import { createServerApiClient } from '@sprintstack/api-client/server-client';
import type { AnyVariables, TypedDocumentNode } from '@urql/core';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { cache } from 'react';

const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

/**
 * One client per request, carrying the visitor's session cookie straight to the API (not through
 * the /api/graphql rewrite). cf-connecting-ip goes along so the API rate-limits per visitor rather
 * than lumping every server render under this server's address.
 */
const getClient = cache(async () => {
  // Wait for a real request. headers() alone isn't enough: partial prefetching renders with the
  // request's headers available, and urql would then run there and call Date.now() (its dev-mode
  // debug events), which that render rejects. The queries are per-request work anyway.
  await connection();
  const request = await headers();
  const forwarded: Record<string, string> = { cookie: request.get('cookie') ?? '' };
  const ip = request.get('cf-connecting-ip');
  if (ip) forwarded['cf-connecting-ip'] = ip;
  return createServerApiClient({ url: `${apiUrl}/graphql`, headers: forwarded });
});

/**
 * Runs a query from a route. A rejected session goes to sign-in; any other error throws, for the
 * nearest error boundary. It only runs at request time, so with cacheComponents start it without
 * awaiting and read the result with use() inside <Suspense>.
 */
export const serverQuery = async <Data, Variables extends AnyVariables>(
  query: TypedDocumentNode<Data, Variables>,
  variables: Variables,
): Promise<Data> => {
  const client = await getClient();
  const { data, error } = await client.query(query, variables).toPromise();
  if (error) {
    if (isUnauthenticated(error)) redirect('/signin');
    throw error;
  }
  if (!data) throw new Error('The API returned no data');
  return data;
};
