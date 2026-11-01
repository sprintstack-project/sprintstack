'use client';

import NextError from 'next/error';
import { useEffect } from 'react';
import { trackError } from '@/lib/monitoring';

/**
 * Replaces the root layout when it fails to render, so it brings its own <html> and <body>. Errors
 * further down are caught by PostHog's exception autocapture (src/instrumentation-client.ts).
 */
const GlobalErrorPage = ({ error }: { error: unknown; retry: () => void }) => {
  useEffect(() => {
    trackError(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* The App Router has no status code for render errors; 0 shows the generic message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
};

export default GlobalErrorPage;
