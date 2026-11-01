import posthog from 'posthog-js';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

// Error tracking only: uncaught errors and unhandled rejections, plus what src/lib/monitoring.ts
// reports. Everything that tracks people is off, nothing is stored in the browser (no cookie) and
// no one is identified, so reports aren't tied to a person. Without the env, it's off.
if (projectToken && host) {
  posthog.init(projectToken, {
    api_host: host,
    capture_exceptions: true,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    rageclick: false,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    capture_performance: false,
    disable_session_recording: true,
    disable_surveys: true,
    disable_product_tours: true,
    disable_conversations: true,
    advanced_disable_flags: true,
    persistence: 'memory',
  });
  // No location looked up from the visitor's IP. posthog-js has no option for it (its `ip` does
  // nothing), so every event carries the property PostHog checks.
  posthog.register({ $geoip_disable: true });
}
