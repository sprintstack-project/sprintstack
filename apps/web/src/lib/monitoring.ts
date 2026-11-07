import * as Sentry from '@sentry/nextjs';

/**
 * Manual error reporting to Sentry (set up in src/instrumentation-client.ts). Browser code only.
 * Reports carry no user ID, name or email. Without NEXT_PUBLIC_SENTRY_DSN these do nothing.
 */

/** Details sent with an error. */
export type TrackProperties = Record<string, string | number | boolean>;

/** An error the app caught and handled, so it would otherwise go unreported. */
export const trackError = (error: unknown, properties?: TrackProperties) => {
  Sentry.captureException(error, { extra: properties });
};
