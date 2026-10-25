import { useField } from '@ui/field';
import { Text } from '@ui/text';
import type { CodeInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

const digitsOnly = (text: string, length: number) => text.replace(/\D/g, '').slice(0, length);

/**
 * One transparent TextInput laid over the digit boxes: typing, paste and the OS's one-time-code
 * suggestion all land in a single field, and the boxes just show its value.
 */
const CodeInput = ({
  id,
  length = 6,
  value,
  defaultValue,
  onChange,
  onComplete,
  autoFocus,
  invalid,
  disabled,
  onBlur,
}: CodeInputProps) => {
  const field = useField();
  const [own, setOwn] = useState(() => digitsOnly(defaultValue ?? '', length));
  const [focused, setFocused] = useState(false);
  const code = value === undefined ? own : digitsOnly(value, length);
  const isInvalid = invalid || field?.invalid;
  const active = Math.min(code.length, length - 1);

  const update = (text: string) => {
    const next = digitsOnly(text, length);
    if (value === undefined) setOwn(next);
    onChange?.(next);
    if (next.length === length && next !== code) onComplete?.(next);
  };

  return (
    <View className="relative flex-row gap-2">
      {Array.from({ length }, (_, index) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: boxes are positional.
          key={index}
          className={clsx(
            'h-16 flex-1 items-center justify-center rounded-lg border-[1.5px] bg-surface',
            disabled
              ? 'border-line bg-surface-muted'
              : isInvalid
                ? 'border-brand'
                : focused && index === active
                  ? 'border-ink'
                  : 'border-line-strong',
          )}
        >
          <Text
            className={clsx(
              'text-[1.875rem] leading-9 font-extrabold',
              disabled ? 'text-ink-disabled' : 'text-ink',
            )}
          >
            {code[index] ?? ''}
          </Text>
        </View>
      ))}
      <TextInput
        nativeID={id}
        value={code}
        onChangeText={update}
        editable={!disabled}
        autoFocus={autoFocus}
        // No maxLength: it would cut a pasted "123 456" before the space is stripped.
        inputMode="numeric"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        caretHidden
        contextMenuHidden={false}
        accessibilityLabel={field?.label}
        aria-labelledby={field?.labelId}
        accessibilityHint={field?.hint}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className="absolute inset-0 text-transparent opacity-[0.02]"
      />
    </View>
  );
};

export default CodeInput;
