import { useLoop, useReducedMotion } from '@lib/motion.native';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import Text from '@ui/text';
import type { SpinnerProps } from '@ui/types';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/** A faint track and a short arc, the same geometry as web. */
const Ring = ({ size = 20, color }: Pick<SpinnerProps, 'size' | 'color'>) => {
  const muted = useTokenColor('ink-muted');
  const brand = useTokenColor('brand-ink');
  // Spinners are how people know something is happening, so reduced motion slows it, not stops it.
  const turn = useLoop(useReducedMotion() ? 2500 : 1000);
  const px = scaled(size);
  const stroke = color ?? (size === 40 ? brand : muted);

  return (
    <Animated.View
      style={{
        width: px,
        height: px,
        transform: [
          { rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
        ],
      }}
    >
      <Svg aria-hidden width={px} height={px} viewBox="0 0 24 24" fill="none">
        <Circle
          cx={12}
          cy={12}
          r={10}
          stroke={stroke}
          strokeWidth={size === 40 ? 1.75 : 2.5}
          opacity={0.25}
        />
        <Circle
          cx={12}
          cy={12}
          r={10}
          stroke={stroke}
          strokeWidth={size === 40 ? 1.75 : 2.5}
          strokeLinecap="round"
          strokeDasharray="16 100"
        />
      </Svg>
    </Animated.View>
  );
};

const Spinner = ({ size = 20, label, color }: SpinnerProps) => {
  if (!label) {
    return (
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ring size={size} color={color} />
      </View>
    );
  }
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      className="flex-row items-center gap-2.5"
    >
      <Ring size={size} color={color} />
      <Text className="text-[1.0625rem] leading-5 font-semibold text-ink-muted">{label}</Text>
    </View>
  );
};

export default Spinner;
