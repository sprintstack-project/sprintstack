import { fieldShell } from '@lib/field-shell.native';
import { scaled } from '@lib/scale';
import { useField } from '@ui/Field';
import { Text } from '@ui/Text';
import type { TextAreaProps } from '@ui/types';
import { clsx } from 'clsx';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

// Roughly one text line per row, matching web's rows attribute.

export function TextArea({
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  invalid,
  disabled,
  onBlur,
}: TextAreaProps) {
  const field = useField();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(defaultValue ?? '');
  const length = (value ?? draft).length;
  // Past the limit we flag the field instead of truncating (maxLength is not passed to TextInput).
  const over = maxLength !== undefined && length > maxLength;

  return (
    <View
      className={fieldShell(
        { focused, invalid: invalid || over || field?.invalid, disabled },
        'gap-2 px-5 pt-4 pb-3',
      )}
    >
      <TextInput
        multiline
        textAlignVertical="top"
        nativeID={id}
        value={value}
        defaultValue={defaultValue}
        onChangeText={(next) => {
          setDraft(next);
          onChange?.(next);
        }}
        placeholder={placeholder}
        editable={!disabled}
        accessibilityLabel={field?.label}
        aria-labelledby={field?.labelId}
        accessibilityHint={field?.hint}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        // Grows with content up to 320px, then scrolls.
        style={{ minHeight: scaled(Math.max(96, rows * 24)) }}
        className={clsx(
          'max-h-80 p-0 text-[1.0625rem] leading-6',
          disabled ? 'text-ink-disabled' : 'text-ink',
        )}
        placeholderTextColorClassName={disabled ? 'accent-ink-disabled' : 'accent-ink-placeholder'}
        cursorColorClassName="accent-ink"
        selectionColorClassName="accent-brand"
      />
      {maxLength !== undefined && (
        <Text
          accessibilityLabel={`${length} of ${maxLength} characters`}
          className={clsx(
            'self-end text-[0.8125rem] font-semibold',
            over ? 'text-brand-ink' : 'text-ink-muted',
          )}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {length} / {maxLength}
        </Text>
      )}
    </View>
  );
}
