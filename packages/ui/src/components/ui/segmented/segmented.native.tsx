import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/field';
import { Text } from '@ui/text';
import type { IconComponent, SegmentedProps } from '@ui/types';
import { clsx } from 'clsx';
import { Pressable, View } from 'react-native';

const Option = ({
  label,
  ariaLabel,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  ariaLabel?: string;
  icon?: IconComponent;
  selected: boolean;
  onPress: () => void;
}) => {
  const color = useTokenColor(selected ? 'on-ink' : 'ink');
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      hitSlop={touchSlop(44)}
      className={clsx(
        'h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full',
        selected ? 'bg-ink' : 'active:bg-surface-pressed',
      )}
    >
      {Icon && <Icon aria-hidden size={scaled(22)} strokeWidth={2} color={color} />}
      <Text
        className={clsx(
          'text-[1.0625rem] leading-5 font-extrabold',
          selected ? 'text-on-ink' : 'text-ink',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const Segmented = <V extends string>({
  label,
  choices,
  value,
  onValueChange,
  onBlur,
}: SegmentedProps<V>) => {
  const field = useField();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={field?.label ?? label}
      accessibilityHint={field?.hint}
      className="flex-row rounded-full bg-surface-muted p-1"
    >
      {choices.map((choice) => (
        <Option
          key={choice.value}
          label={choice.label}
          ariaLabel={choice.ariaLabel}
          icon={choice.icon}
          selected={value === choice.value}
          // A pick is a complete answer, so it also counts as leaving the field.
          onPress={() => {
            onValueChange(choice.value);
            onBlur?.();
          }}
        />
      ))}
    </View>
  );
};

export default Segmented;
