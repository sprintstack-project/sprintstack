import type { CombinedError } from '@urql/core';

/** Whether the API rejected the session (no cookie, expired or revoked). */
export const isUnauthenticated = (error: CombinedError) =>
  error.response?.status === 401 ||
  error.graphQLErrors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
