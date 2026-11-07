import { MIN_HOLD, SHOW_AFTER, SLOW_AFTER, TIMEOUT_AFTER } from '@lib/loading';
import { useEffect, useRef, useState } from 'react';

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
