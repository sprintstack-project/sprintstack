import type { SkeletonProps } from '@ui/types';

// The loading rules from the design. Shared by web and native, and free of hooks so server
// components can import it (the hooks live in use-load-phase and use-button-status).
export const SHOW_AFTER = 300;
export const MIN_HOLD = 500;
export const SLOW_AFTER = 8_000;
export const TIMEOUT_AFTER = 30_000;
export const DONE_FOR = 1_500;

type Shape = NonNullable<SkeletonProps['shape']>;

/** Skeleton sizes, matching the real components (radius 8 is 0.5rem; rounded-lg is 16). */
export const SKELETON_SHAPES: Record<Shape, string> = {
  line: 'h-3.5 rounded-[0.5rem]',
  heading: 'h-[1.625rem] rounded-[0.5rem]',
  circle: 'rounded-full',
  pill: 'h-7 rounded-full',
  control: 'rounded-full',
  input: 'h-14 rounded-lg',
  bar: 'h-2 rounded-full',
  icon: 'rounded-[0.5rem]',
};

export const SKELETON_CONTROL_HEIGHTS = { sm: 'h-10', md: 'h-12', lg: 'h-14' };

/** Spec px for the shapes that don't fill the width. Circle and icon are square. */
export const SKELETON_DEFAULT_WIDTH: Partial<Record<Shape, number>> = {
  pill: 96,
  circle: 40,
  icon: 24,
};

/** A paragraph's line widths: full, then a little shorter, the last about half. */
export const skeletonLineWidths = (lines: number) =>
  Array.from({ length: lines }, (_, i) =>
    i === lines - 1 && lines > 1 ? '60%' : i % 2 ? '85%' : '100%',
  );
