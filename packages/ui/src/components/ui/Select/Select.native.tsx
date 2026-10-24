import { fieldShell } from '@lib/field-shell.native';
import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/Field/Field';
import { Caret } from '@ui/Select/Caret';
import { OptionContent, optionText } from '@ui/Select/OptionContent';
import type { SelectProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function Select<V = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  defaultOpen,
  invalid,
  disabled,
  onBlur,
}: SelectProps<V>) {
  const field = useField();
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const selected = options.find((o) => o.value === current);
  const checkColor = useTokenColor('brand-ink');

  const show = () => {
    setOpen(true);
    sheet.current?.show();
  };
  useEffect(() => {
    if (defaultOpen) sheet.current?.show();
  }, [defaultOpen]);

  return (
    <>
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

      <Sheet
        sheetRef={sheet}
        title={field?.label}
        onClose={() => {
          setOpen(false);
          onBlur?.();
        }}
      >
        {options.map((option, index) => {
          const isSelected = option.value === current;
          return (
            <Pressable
              key={String(option.value)}
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
        })}
      </Sheet>
    </>
  );
}
