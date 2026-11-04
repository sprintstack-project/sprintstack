import { Button } from '@ui/button';
import { Spinner } from '@ui/spinner';
import type { SaveStatusProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check, TriangleAlert } from 'lucide-react';

const text = 'text-[1.0625rem] leading-5 font-semibold font-stretch-semi-condensed';

const SaveStatus = ({ state, savedAt, onRetry }: SaveStatusProps) => {
  return (
    <span className="inline-flex items-center gap-3">
      {/* Only the words are live: the Retry link isn't re-read with every change. */}
      <span
        role="status"
        className={clsx(
          'inline-flex items-center gap-2.5',
          text,
          state === 'error' ? 'text-danger' : 'text-ink-muted',
        )}
      >
        {state === 'saving' && (
          <>
            <Spinner size={16} />
            Saving…
          </>
        )}
        {state === 'saved' && (
          <>
            <Check aria-hidden strokeWidth={2} className="size-5 shrink-0 text-success" />
            {savedAt ? `Saved · ${savedAt}` : 'Saved'}
          </>
        )}
        {state === 'error' && (
          <>
            <TriangleAlert aria-hidden strokeWidth={2} className="size-5 shrink-0" />
            Couldn’t save.
          </>
        )}
      </span>
      {state === 'error' && onRetry && (
        <Button variant="link" onClick={onRetry}>
          Retry
        </Button>
      )}
    </span>
  );
};

export default SaveStatus;
