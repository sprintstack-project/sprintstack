import posthog from 'posthog-js';

/**
 * Manual error reporting to PostHog error tracking (set up in src/instrumentation-client.ts).
 * Browser code only. Reports carry no user ID, name or email. Without the PostHog env these do
 * nothing.
 */

/** Details sent with an error. */
export type TrackProperties = Record<string, string | number | boolean>;

/** An error the app caught and handled, so it would otherwise go unreported. */
export const trackError = (error: unknown, properties?: TrackProperties) => {
  if (posthog.__loaded) posthog.captureException(error, properties);
};
