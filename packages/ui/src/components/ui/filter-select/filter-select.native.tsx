import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { optionText } from '@ui/select/option-content';
import Select from '@ui/select/select';
import { Text } from '@ui/text';
import type { FilterSelectProps } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

const FilterSelect = <V = string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'All',
  count,
  block,
  disabled,
}: FilterSelectProps<V>) => {
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const selected = options.find((o) => o.value === current);
  const caret = useTokenColor(disabled ? 'ink-disabled' : 'ink-muted');

  return (
    <Select<V>
      options={options}
      value={current}
      onValueChange={(next) => {
        setOwnValue(next);
        onValueChange?.(next);
      }}
      disabled={disabled}
      trigger={{
        label,
        hitSlop: touchSlop(48),
        className: clsx(
          'h-12 flex-row items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 active:bg-surface-pressed',
          block ? 'self-stretch' : 'self-start',
        ),
        children: (
          <>
            <Text className="text-[1.0625rem] leading-5 font-semibold text-ink-muted">{label}</Text>
            <Text
              numberOfLines={1}
              className={clsx(
                'shrink text-[1.0625rem] leading-5 font-bold',
                disabled ? 'text-ink-disabled' : 'text-ink',
                block && 'flex-1',
              )}
            >
              {selected ? optionText(selected) : placeholder}
            </Text>
            {count !== undefined && (
              <View className="size-6 items-center justify-center rounded-full bg-ink">
                <Text className="text-[0.8125rem] font-extrabold text-on-ink">{count}</Text>
              </View>
            )}
            <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={caret} />
          </>
        ),
      }}
    />
  );
};

export default FilterSelect;
