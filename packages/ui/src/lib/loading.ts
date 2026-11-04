import type { ButtonProps, SkeletonProps } from '@ui/types';
import { useEffect, useRef, useState } from 'react';

// The loading rules from the design. Shared by web and native.
const SHOW_AFTER = 300;
const MIN_HOLD = 500;
const SLOW_AFTER = 8_000;
const TIMEOUT_AFTER = 30_000;
const DONE_FOR = 1_500;

/** waiting: nothing yet · skeleton · slow: skeleton and the note · timeout: give up · done. */
export type LoadPhase = 'waiting' | 'skeleton' | 'slow' | 'timeout' | 'done';

/**
 * Where a load is on the timeline. A skeleton that has appeared stays for MIN_HOLD even if the
 * data lands sooner, so it doesn't blink. `restart` reruns the timers when a retry keeps `loading`
 * true throughout (e.g. a refetch after a timeout).
 */
export const useLoadPhase = (loading: boolean) => {
  const [phase, setPhase] = useState<LoadPhase>(loading ? 'waiting' : 'done');
  const [attempt, setAttempt] = useState(0);
  const shownAt = useRef<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` only restarts the timers.
  useEffect(() => {
    if (loading) {
      shownAt.current = null;
      setPhase('waiting');
      const timers = [
        setTimeout(() => {
          shownAt.current = Date.now();
          setPhase('skeleton');
        }, SHOW_AFTER),
        setTimeout(() => setPhase('slow'), SLOW_AFTER),
        setTimeout(() => setPhase('timeout'), TIMEOUT_AFTER),
      ];
      return () => timers.forEach(clearTimeout);
    }
    const shown = shownAt.current;
    const hold = shown === null ? 0 : Math.max(0, shown + MIN_HOLD - Date.now());
    if (hold === 0) {
      setPhase('done');
      return;
    }
    const timer = setTimeout(() => setPhase('done'), hold);
    return () => clearTimeout(timer);
  }, [loading, attempt]);

  return { phase, restart: () => setAttempt((n) => n + 1) };
};

/** What a Button shows: `done` lasts DONE_FOR, then it's idle until `status` changes again. */
export const useButtonStatus = (status: ButtonProps['status']) => {
  const [flash, setFlash] = useState(status === 'done');

  useEffect(() => {
    if (status !== 'done') {
      setFlash(false);
      return;
    }
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), DONE_FOR);
    return () => clearTimeout(timer);
  }, [status]);

  if (status === 'pending') return 'pending';
  return status === 'done' && flash ? 'done' : 'idle';
};

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
