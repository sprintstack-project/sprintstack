import { clsx } from 'clsx';

/** The floating panel behind menus and pickers (Select, MultiSelect, DatePicker). */
export const popupFrame = clsx(
  'rounded-lg border border-line bg-surface shadow-popover outline-none',
  // Menus drop 6px into place.
  'origin-(--transform-origin) transition-[opacity,translate] duration-140 ease-out data-ending-style:opacity-0 data-starting-style:-translate-y-1.5 data-starting-style:opacity-0',
  'motion-reduce:transition-none',
);

/** A frame that scrolls its own content (short, non-virtualized menus). */
export const popup = clsx(
  popupFrame,
  'max-h-[min(var(--available-height),26.25rem)] overflow-y-auto p-2',
);

/**
 * A 56px menu row. The highlight hides the hairlines on both sides. The hairline is always out of
 * flow (an in-flow ::before would add a flex gap); add `hairline` (sibling rows) or colour it by
 * index (virtual rows, whose first rendered row isn't the first row).
 */
export const row = clsx(
  'group relative flex min-h-14 cursor-pointer items-center gap-4 rounded-md px-4 text-[1.0625rem] leading-6 text-ink outline-none select-none',
  'before:absolute before:inset-x-0 before:top-0 before:h-px',
  'data-highlighted:bg-surface-hover data-highlighted:before:opacity-0 [[data-highlighted]+&]:before:opacity-0',
  'data-disabled:cursor-not-allowed data-disabled:text-ink-disabled',
);

export const hairline = '[&+&]:before:bg-line';
