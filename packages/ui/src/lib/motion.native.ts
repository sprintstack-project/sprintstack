import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

/** The OS "reduce motion" setting, kept current while mounted. */
export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
};

/** A linear 0→1 value that repeats every `duration` ms while mounted and `enabled` (else it rests at 0). */
export const useLoop = (duration: number, enabled = true) => {
  const [value] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!enabled) return;
    value.setValue(0);
    const loop = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, value, duration]);
  return value;
};

// One clock for every skeleton block, so they sweep together rather than out of step.
const shimmer = new Animated.Value(0);
let shimmerUsers = 0;
let shimmerLoop: Animated.CompositeAnimation | undefined;

/** The shared 1.4 s skeleton sweep, 0→1 (null under reduced motion). */
export const useShimmer = () => {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    shimmerUsers += 1;
    if (shimmerUsers === 1) {
      shimmer.setValue(0);
      shimmerLoop = Animated.loop(
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      );
      shimmerLoop.start();
    }
    return () => {
      shimmerUsers -= 1;
      if (shimmerUsers === 0) shimmerLoop?.stop();
    };
  }, [reduced]);
  return reduced ? null : shimmer;
};
