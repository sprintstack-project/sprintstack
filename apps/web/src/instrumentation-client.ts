import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from '@/lib/sentry-options';

// Sentry, errors only (options in src/lib/sentry-options.ts). No session counting, and clicks and
// key presses aren't recorded as breadcrumbs. Without NEXT_PUBLIC_SENTRY_DSN it's off.
Sentry.init({
  ...sentryOptions,
  integrations: (defaults) => [
    ...defaults.filter((integration) => integration.name !== 'BrowserSession'),
    Sentry.breadcrumbsIntegration({ dom: false }),
  ],
});
