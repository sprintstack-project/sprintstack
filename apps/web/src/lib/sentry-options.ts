import type { init } from '@sentry/nextjs';

/**
 * Sentry options shared by the browser (src/instrumentation-client.ts) and the server and edge
 * runtimes (src/instrumentation.ts). Errors only: no tracing, replay or logs. Nothing that
 * identifies a person is collected: no user, IP, cookies, headers, bodies, query strings, GraphQL
 * variables or local variables. Without NEXT_PUBLIC_SENTRY_DSN nothing is sent.
 */
export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    graphQL: { document: false, variables: false },
    databaseQueryData: false,
    stackFrameVariables: false,
  },
} satisfies Parameters<typeof init>[0];
