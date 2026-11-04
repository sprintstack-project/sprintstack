import {
  SKELETON_CONTROL_HEIGHTS,
  SKELETON_DEFAULT_WIDTH,
  SKELETON_SHAPES,
  skeletonLineWidths,
} from '@lib/loading';
import type { SkeletonProps } from '@ui/types';
import { clsx } from 'clsx';

/** Spec px to rem (1rem = 16px at full scale); percentages pass through. */
const toCss = (width: SkeletonProps['width']) =>
  typeof width === 'number' ? `${width / 16}rem` : width;

const Skeleton = ({ shape = 'line', width, size = 'md', lines }: SkeletonProps) => {
  const w = toCss(width ?? SKELETON_DEFAULT_WIDTH[shape]);

  if (shape === 'line' && lines && lines > 1) {
    return (
      <span aria-hidden className="flex flex-col gap-2.5" style={{ width: w }}>
        {skeletonLineWidths(lines).map((lineWidth, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: the lines are identical placeholders.
            key={i}
            className={clsx('skeleton block', SKELETON_SHAPES.line)}
            style={{ width: lineWidth }}
          />
        ))}
      </span>
    );
  }

  const square = shape === 'circle' || shape === 'icon';
  return (
    <span
      aria-hidden
      className={clsx(
        'skeleton block shrink-0',
        SKELETON_SHAPES[shape],
        shape === 'control' && SKELETON_CONTROL_HEIGHTS[size],
        !w && 'w-full',
      )}
      style={square ? { width: w, height: w } : { width: w }}
    />
  );
};

export default Skeleton;
