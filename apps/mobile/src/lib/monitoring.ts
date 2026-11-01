import { getApp } from '@react-native-firebase/app';
import { getCrashlytics, log, recordError } from '@react-native-firebase/crashlytics';
import { posthog } from './posthog';

/**
 * Crash and error reporting, to Crashlytics (alongside the app's other Firebase data) and PostHog
 * error tracking. Import this before anything else renders, so JS crashes are caught from the
 * moment it runs. Reports carry no user ID, name or email: only the device and app diagnostics.
 */

// Null where Firebase isn't set up (a build without its config files), as in push.ts. Creating it
// installs Crashlytics' JS error handler. It collects nothing in debug builds (its default).
const crashlytics = (() => {
  try {
    return getCrashlytics(getApp());
  } catch {
    return null;
  }
})();

/** Details logged with an event or error. */
export type TrackProperties = Record<string, string | number | boolean>;

/**
 * Something the app went through, such as "sync.retried". Listed in the log of the next Crashlytics
 * crash or error report; nothing is sent on its own.
 */
export const trackEvent = (name: string, properties?: TrackProperties) => {
  if (crashlytics) log(crashlytics, properties ? `${name} ${JSON.stringify(properties)}` : name);
};

/** An error the app caught and handled, so it would otherwise go unreported. */
export const trackError = (error: unknown, properties?: TrackProperties) => {
  posthog.captureException(error, properties);
  if (crashlytics)
    recordError(crashlytics, error instanceof Error ? error : new Error(String(error)));
};
