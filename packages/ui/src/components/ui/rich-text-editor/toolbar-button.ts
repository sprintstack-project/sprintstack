import { clsx } from 'clsx';

/** A 36px toolbar button; pressed (a mark is on) or open (its popover is showing) fills it. */
export const toolbarButton = clsx(
  'grid size-9 cursor-pointer place-items-center rounded-md text-ink hover:bg-surface-hover',
  'data-pressed:bg-ink data-pressed:text-on-ink data-popup-open:bg-surface-hover',
  'disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
  'focus-visible:outline-2 focus-visible:outline-focus-ring',
);
