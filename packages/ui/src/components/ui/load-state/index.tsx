'use client';

import { useLoadPhase } from '@lib/loading';
import Button from '@ui/button';
import Spinner from '@ui/spinner';
import type { LoadStateProps } from '@ui/types';
import { TriangleAlert } from 'lucide-react';

const LoadState = ({
  loading,
  label,
  skeleton,
  children,
  failed,
  slowMessage = 'Still loading. This can take a few seconds.',
  errorTitle = 'Couldn’t load this',
  errorDescription = 'Check your connection and try again.',
  errorDetail,
  onRetry,
}: LoadStateProps) => {
  const { phase, restart } = useLoadPhase(loading);
  const busy = phase === 'waiting' || phase === 'skeleton' || phase === 'slow';
  const showSkeleton = phase === 'skeleton' || phase === 'slow';
  const showError = phase === 'timeout' || (phase === 'done' && failed);

  const retry = () => {
    restart();
    onRetry?.();
  };

  return (
    <div aria-busy={busy}>
      {/* Always mounted, so the label is announced once, when the skeleton appears (a fast load
          says nothing). */}
      <p role="status" className="sr-only">
        {showSkeleton ? label : ''}
      </p>

      {showSkeleton && (
        <>
          <div aria-hidden>{skeleton}</div>
          {phase === 'slow' && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-muted px-4 py-3.5 text-[1.0625rem] leading-5 font-semibold text-ink font-stretch-semi-condensed">
              <Spinner size={20} />
              {slowMessage}
            </div>
          )}
        </>
      )}

      {showError && (
        <div role="alert" className="rounded-xl border-[1.5px] border-danger p-6">
          <span className="grid size-12 place-items-center rounded-full bg-danger/15 text-danger">
            <TriangleAlert aria-hidden strokeWidth={2} className="size-6" />
          </span>
          <h3 className="headline mt-5 text-title text-ink">{errorTitle}</h3>
          <p className="mt-2 text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
            {errorDescription}
          </p>
          {(onRetry || errorDetail) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {onRetry && (
                <Button variant="primary" size="sm" onClick={retry}>
                  Retry
                </Button>
              )}
              {errorDetail && <span className="text-meta text-ink-muted">{errorDetail}</span>}
            </div>
          )}
        </div>
      )}

      {phase === 'done' && !failed && children}
    </div>
  );
};

export default LoadState;
