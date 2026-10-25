import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { CheckboxProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

const Checkbox = ({
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  error,
  disabled,
}: CheckboxProps) => {
  const [own, setOwn] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? own;
  const onInk = useTokenColor('on-ink');

  const toggle = () => {
    if (checked === undefined) setOwn(!isChecked);
    onCheckedChange?.(!isChecked);
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      accessibilityHint={error}
      disabled={disabled}
      onPress={toggle}
      hitSlop={touchSlop(22)}
      className="flex-row items-start gap-3"
    >
      <View
        className={clsx(
          'mt-px size-5.5 items-center justify-center rounded-sm border-[1.5px]',
          disabled
            ? 'border-line bg-surface-muted'
            : isChecked
              ? 'border-ink bg-ink'
              : error
                ? 'border-brand bg-surface'
                : 'border-line-strong bg-surface',
        )}
      >
        {isChecked && <Check size={scaled(16)} strokeWidth={3} color={onInk} aria-hidden />}
      </View>
      <View className="flex-1 gap-1">
        {typeof children === 'string' ? (
          <Text className="text-body font-semibold text-ink">{children}</Text>
        ) : (
          children
        )}
        {error && <Text className="text-meta font-bold text-brand-ink">{error}</Text>}
      </View>
    </Pressable>
  );
};

export default Checkbox;
