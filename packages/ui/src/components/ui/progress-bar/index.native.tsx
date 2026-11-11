import { useLoop, useReducedMotion } from '@lib/motion.native';
import Text from '@ui/text';
import type { ProgressBarProps } from '@ui/types';
import { useState } from 'react';
import { Animated, View } from 'react-native';

/** The indeterminate segment: 40% of the track, running along it. Reduced motion: a still, dimmed track. */
const Sweep = () => {
  const reduced = useReducedMotion();
  const run = useLoop(1400, !reduced);
  const [width, setWidth] = useState(0);

  if (reduced) return <View className="h-full w-full rounded-full bg-brand opacity-40" />;
  return (
    <View className="h-full w-full" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {/* Uniwind styles RN's own View; the animated wrapper only moves it. */}
      <Animated.View
        style={{
          width: width * 0.4,
          height: '100%',
          transform: [
            {
              translateX: run.interpolate({
                inputRange: [0, 1],
                outputRange: [-width * 0.4, width],
              }),
            },
          ],
        }}
      >
        <View className="h-full w-full rounded-full bg-brand" />
      </Animated.View>
    </View>
  );
};

const ProgressBar = ({ label, value, showValue, color }: ProgressBarProps) => {
  const pct = value === undefined ? undefined : Math.round(Math.min(100, Math.max(0, value)));

  return (
    <View className="flex-row items-center gap-3 self-stretch">
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityValue={pct === undefined ? undefined : { min: 0, max: 100, now: pct }}
        className="h-0.75 flex-1 overflow-hidden rounded-full bg-brand-subtle"
      >
        {pct === undefined ? (
          <Sweep />
        ) : (
          <View
            className={`h-full rounded-full ${color === 'danger' ? 'bg-danger' : 'bg-brand'}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </View>
      {showValue && pct !== undefined && (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          className="w-10 text-right text-meta text-ink-muted"
        >
          {pct}%
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;
