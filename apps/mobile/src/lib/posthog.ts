import Constants from 'expo-constants';
import PostHog from 'posthog-react-native';

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken as string | undefined;
const host = extra?.posthogHost as string | undefined;

/**
 * Error tracking only: uncaught exceptions and unhandled rejections, plus what src/lib/monitoring.ts
 * reports. No lifecycle events, screens or touches (the provider in src/app/_layout.tsx keeps
 * autocapture off), and no feature flags or surveys. Without POSTHOG_PROJECT_TOKEN and POSTHOG_HOST
 * the client exists but stays off, so usePostHog() always has one.
 */
export const posthog = new PostHog(projectToken ?? 'disabled', {
  host,
  disabled: !projectToken || !host,
  captureAppLifecycleEvents: false,
  preloadFeatureFlags: false,
  disableRemoteFeatureFlags: true,
  disableSurveys: true,
  // No location looked up from the device's IP.
  disableGeoip: true,
  errorTracking: { autocapture: { uncaughtExceptions: true, unhandledRejections: true } },
});
