import { clsx } from 'clsx';

/** The solid ▾ caret for selects (multi-selects and nav use a chevron). Rotates while open. */
export function Caret({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 6"
      className={clsx(
        'h-1.5 w-2.5 shrink-0 fill-current transition-transform duration-120 ease-out',
        className,
      )}
    >
      <path d="M0 0h10L5 6z" />
    </svg>
  );
}
