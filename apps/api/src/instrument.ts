import * as Sentry from '@sentry/nestjs';

// Runs before ConfigModule, so read .env here for local development. It's absent in production,
// where the variables come from the environment.
try {
  process.loadEnvFile();
} catch {}

/**
 * Sentry error tracking: what ErrorReportingFilter reports, plus uncaught exceptions and unhandled
 * rejections outside requests. Errors only: no tracing or logs. Nothing that identifies a person
 * is collected: no user, IP, cookies, headers, bodies, query strings, GraphQL data, database
 * parameters or local variables. Without SENTRY_DSN nothing is sent.
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV ?? 'development',
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
});
