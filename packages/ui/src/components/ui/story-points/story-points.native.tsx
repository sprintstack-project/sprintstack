import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import SelectWithTrigger from '@ui/select/select';
import { Text } from '@ui/text';
import type { Option, StoryPointsProps } from '@ui/types';
import { clsx } from 'clsx';
import { CircleAlert, Ellipsis } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

const DEFAULT_SCALE = [1, 2, 3, 5, 8, 13];
const DEFAULT_MORE = [0, 21, 34];

const box = (selected: boolean) =>
  clsx(
    'h-11 min-w-0 flex-1 items-center justify-center rounded-lg',
    selected ? 'bg-ink' : 'active:bg-surface-pressed',
  );

const labelClass = (selected: boolean, disabled?: boolean) =>
  clsx(
    'text-[1.0625rem] leading-5 font-extrabold',
    disabled ? 'text-ink-disabled' : selected ? 'text-on-ink' : 'text-ink',
  );

const StoryPoints = ({
  label = 'Story points',
  value,
  defaultValue,
  onValueChange,
  onBlur,
  scale = DEFAULT_SCALE,
  more = DEFAULT_MORE,
  error,
  disabled,
}: StoryPointsProps) => {
  const [ownValue, setOwnValue] = useState(defaultValue ?? null);
  const points = value === undefined ? ownValue : value;
  const inMore = points !== null && more.includes(points);
  const ink = useTokenColor(disabled ? 'ink-disabled' : 'ink');
  const errorColor = useTokenColor('brand-ink');

  // A pick is a complete answer, so it also counts as leaving the field.
  const set = (next: number | null) => {
    setOwnValue(next);
    onValueChange?.(next);
    onBlur?.();
  };

  const moreOptions: Option<number>[] = [
    ...more.map((n) => ({ value: n, label: `${n} points` })),
    ...(points === null ? [] : [{ value: -1, label: 'No estimate', action: () => set(null) }]),
  ];

  return (
    <View className="gap-2">
      <Text className="text-[1.0625rem] leading-5.5 font-bold text-ink">{label}</Text>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={label}
        accessibilityHint={error}
        className={clsx(
          'flex-row gap-1 rounded-xl bg-surface-muted p-1',
          error && 'border-2 border-brand',
        )}
      >
        {scale.map((n) => (
          <Pressable
            key={n}
            accessibilityRole="radio"
            accessibilityLabel={`${n} points`}
            accessibilityState={{ checked: points === n, disabled: Boolean(disabled) }}
            disabled={disabled}
            onPress={() => set(points === n ? null : n)}
            hitSlop={touchSlop(44)}
            className={box(points === n)}
          >
            <Text className={labelClass(points === n, disabled)}>{n}</Text>
          </Pressable>
        ))}
        <SelectWithTrigger<number>
          options={moreOptions}
          value={inMore ? points : null}
          onValueChange={(next) => next !== null && set(next)}
          disabled={disabled}
          trigger={{
            label: inMore ? `More story points, ${points} selected` : 'More story points',
            hitSlop: touchSlop(44),
            className: box(inMore),
            children: inMore ? (
              <Text className={labelClass(true, disabled)}>{points}</Text>
            ) : (
              <Ellipsis aria-hidden size={scaled(20)} strokeWidth={2} color={ink} />
            ),
          }}
        />
      </View>
      {error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-center gap-1">
          <CircleAlert aria-hidden size={scaled(18)} strokeWidth={2} color={errorColor} />
          <Text className="text-meta font-bold text-brand-ink">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default StoryPoints;
