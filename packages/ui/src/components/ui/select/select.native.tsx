import { fieldShell } from '@lib/field-shell.native';
import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/field';
import Caret from '@ui/select/caret';
import OptionContent, { optionText } from '@ui/select/option-content';
import SearchBox from '@ui/select/search-box';
import type { SelectWithTriggerProps } from '@ui/select/trigger';
import { Text } from '@ui/text';
import { clsx } from 'clsx';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { FlatList } from 'react-native-actions-sheet';

const Select = <V = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  defaultOpen,
  invalid,
  disabled,
  onBlur,
  searchable,
  trigger: custom,
}: SelectWithTriggerProps<V>) => {
  const field = useField();
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const selected = options.find((o) => o.value === current);
  const checkColor = useTokenColor('brand-ink');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown =
    searchable && q ? options.filter((o) => optionText(o).toLowerCase().includes(q)) : options;

  const show = () => {
    setOpen(true);
    sheet.current?.show();
  };
  useEffect(() => {
    if (defaultOpen) sheet.current?.show();
  }, [defaultOpen]);

  return (
    <>
      {custom ? (
        <Pressable
          accessibilityRole="combobox"
          accessibilityLabel={custom.label}
          accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
          disabled={disabled}
          onPress={show}
          className={custom.className}
        >
          {custom.children}
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="combobox"
          accessibilityLabel={field?.label}
          accessibilityHint={field?.hint}
          accessibilityValue={{ text: selected ? optionText(selected) : placeholder }}
          accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
          disabled={disabled}
          onPress={show}
          className={fieldShell(
            { focused: open, invalid: invalid || field?.invalid, disabled },
            'flex-row items-center gap-3 px-5',
          )}
        >
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            {selected ? (
              <OptionContent option={selected} inTrigger />
            ) : (
              <Text
                numberOfLines={1}
                className={clsx(
                  'text-[1.0625rem]',
                  disabled ? 'text-ink-disabled' : 'text-ink-placeholder',
                )}
              >
                {placeholder}
              </Text>
            )}
          </View>
          <Caret open={open} disabled={disabled} />
        </Pressable>
      )}

      <Sheet
        sheetRef={sheet}
        title={custom?.label ?? field?.label}
        onClose={() => {
          setOpen(false);
          setQuery('');
          onBlur?.();
        }}
      >
        {searchable && <SearchBox value={query} onChange={setQuery} />}
        {/* Virtualized: only the rows on screen are rendered, however long the list. */}
        <FlatList
          data={shown}
          keyExtractor={(option) => String(option.value)}
          style={{ maxHeight: scaled(480) }}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          windowSize={7}
          ListEmptyComponent={<Text className="p-4 font-semibold text-ink-muted">No matches</Text>}
          renderItem={({ item: option, index }) => {
            const isSelected = option.value === current;
            return (
              <Pressable
                accessibilityRole={option.action ? 'button' : 'radio'}
                accessibilityLabel={optionText(option)}
                accessibilityState={{
                  checked: option.action ? undefined : isSelected,
                  disabled: option.disabled,
                }}
                disabled={option.disabled}
                onPress={() => {
                  sheet.current?.hide();
                  if (option.action) return option.action();
                  setOwnValue(option.value);
                  onValueChange?.(option.value);
                }}
                className={clsx(
                  'min-h-14 flex-row items-center gap-4 rounded-md px-4 active:bg-surface-pressed',
                  // Hairlines between rows, like the web menu.
                  index > 0 && 'border-t border-line',
                )}
              >
                <View className="min-w-0 flex-1 flex-row items-center gap-4">
                  <OptionContent option={option} />
                </View>
                {isSelected && (
                  <Check aria-hidden size={scaled(24)} strokeWidth={2} color={checkColor} />
                )}
              </Pressable>
            );
          }}
        />
      </Sheet>
    </>
  );
};

export default Select;
