'use client';

import { Dialog as Base } from '@base-ui/react/dialog';
import { usePortalContainer } from '@lib/portal-container';
import type { DialogProps } from '@ui/types';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

const Dialog = ({ open, onOpenChange, title, children }: DialogProps) => {
  const container = usePortalContainer();

  return (
    <Base.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Base.Portal container={container}>
        <Base.Backdrop
          className={clsx(
            'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-140',
            'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Base.Popup
          className={clsx(
            'fixed top-1/2 left-1/2 z-(--z-dialog) flex max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] -translate-1/2 flex-col',
            // The dashboard widget's panel, lifted off the page.
            'rounded-xl border border-line bg-surface p-6 text-ink shadow-popover outline-none',
            'transition-[opacity,scale] duration-140 ease-out motion-reduce:transition-none',
            'data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0',
          )}
        >
          <header className="-my-2 flex shrink-0 items-center gap-1">
            <Base.Title className="headline flex-1 truncate text-title text-ink">
              {title}
            </Base.Title>
            <Base.Close
              aria-label="Close"
              className="kbd-focus -mr-2 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors duration-120 hover:bg-surface-hover hover:text-ink"
            >
              <X aria-hidden strokeWidth={2} className="size-5" />
            </Base.Close>
          </header>
          {/* Room either side for focus outlines, which overflow would otherwise clip. */}
          <div className="-mx-1 mt-3 min-h-0 flex-1 overflow-y-auto px-1">{children}</div>
        </Base.Popup>
      </Base.Portal>
    </Base.Root>
  );
};

export default Dialog;
