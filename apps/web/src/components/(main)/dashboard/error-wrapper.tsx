'use client';

import Button from '@ui/button';
import { TriangleAlert } from 'lucide-react';
import { catchError, type ErrorInfo } from 'next/error';

/**
 * Catches a failed tile or widget so the rest of the dashboard still shows. Retry re-renders it
 * on the server, which fetches again.
 */
const ErrorWrapper = catchError(({ label }: { label: string }, { retry }: ErrorInfo) => (
  <div
    role="alert"
    className="flex min-h-50 flex-col items-start justify-center gap-4 rounded-2xl border-[1.5px] border-danger p-6"
  >
    <span className="grid size-12 place-items-center rounded-full bg-danger/15 text-danger">
      <TriangleAlert aria-hidden strokeWidth={2} className="size-6" />
    </span>
    <div>
      <h3 className="headline text-title text-ink">Couldn’t load {label}</h3>
      <p className="mt-1 text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
        Check your connection and try again.
      </p>
    </div>
    <Button size="sm" onClick={retry}>
      Retry
    </Button>
  </div>
));

export default ErrorWrapper;
