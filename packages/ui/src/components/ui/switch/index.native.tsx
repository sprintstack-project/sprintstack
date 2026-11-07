import { scaled, touchSlop } from '@lib/scale';
import type { SwitchProps } from '@ui/types';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, View } from 'react-native';

// The thumb's travel: the track's inner width (72 less 4 padding a side, less the 1.5pt hairline
// borders) less the thumb (28).
const TRAVEL = scaled(72) - scaled(8) - 3 - scaled(28);

const Switch = ({ label, checked, defaultChecked, onCheckedChange, disabled }: SwitchProps) => {
  const [own, setOwn] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? own;
  const offset = useRef(new Animated.Value(isChecked ? TRAVEL : 0)).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      const to = isChecked ? TRAVEL : 0;
      if (reduced) offset.setValue(to);
      else Animated.timing(offset, { toValue: to, duration: 120, useNativeDriver: true }).start();
    });
  }, [isChecked, offset]);

  const toggle = () => {
    if (checked === undefined) setOwn(!isChecked);
    onCheckedChange?.(!isChecked);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={toggle}
      hitSlop={touchSlop(40)}
      className={clsx(
        'h-10 w-18 shrink-0 justify-center rounded-full border-[1.5px] p-1',
        isChecked ? 'border-brand bg-brand' : 'border-line-strong bg-surface-muted',
        disabled && 'opacity-50',
      )}
    >
      {/* Uniwind styles RN's own View; the animated wrapper only moves it. */}
      <Animated.View style={{ transform: [{ translateX: offset }] }}>
        <View className={clsx('size-7 rounded-full', isChecked ? 'bg-on-brand' : 'bg-ink-muted')} />
      </Animated.View>
    </Pressable>
  );
};

export default Switch;
