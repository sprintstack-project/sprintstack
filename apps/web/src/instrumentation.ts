import * as Sentry from '@sentry/nextjs';
import { sentryOptions } from '@/lib/sentry-options';

// Sentry error tracking on the server and edge runtimes (the browser is set up in
// instrumentation-client.ts).
export const register = () => {
  Sentry.init(sentryOptions);
};

// Errors thrown while rendering, in route handlers, server actions and the proxy.
export const onRequestError = Sentry.captureRequestError;
