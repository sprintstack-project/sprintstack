import { fieldShell, tintSlot } from '@lib/field-shell.native';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/Field/Field';
import type { InputProps } from '@ui/types';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
export function Input({
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  slots,
  pill,
  invalid,
  disabled,
  onBlur,
}: InputProps) {
  const field = useField();
  const [focused, setFocused] = useState(false);
  const slotColor = useTokenColor(disabled ? 'ink-disabled' : 'ink-muted');

  return (
    <View
      className={fieldShell(
        { focused, invalid: invalid || field?.invalid, disabled },
        'flex-row items-center gap-3 px-5',
        pill && 'rounded-full',
        pill && slots?.right && 'pr-1.5',
      )}
    >
      {slots?.left && <View className="shrink-0">{tintSlot(slots.left, slotColor)}</View>}
      <TextInput
        nativeID={id}
        value={value}
        defaultValue={defaultValue}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
        secureTextEntry={type === 'password'}
        inputMode={type === 'password' ? 'text' : type}
        autoCapitalize={type === 'text' ? 'sentences' : 'none'}
        autoCorrect={type === 'text'}
        accessibilityLabel={field?.label}
        aria-labelledby={field?.labelId}
        accessibilityHint={field?.hint}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className={
          disabled
            ? 'min-h-14 flex-1 text-[1.0625rem] text-ink-disabled'
            : 'min-h-14 flex-1 text-[1.0625rem] text-ink'
        }
        placeholderTextColorClassName={disabled ? 'accent-ink-disabled' : 'accent-ink-placeholder'}
        cursorColorClassName="accent-ink"
        selectionColorClassName="accent-brand"
      />
      {slots?.right && <View className="shrink-0">{tintSlot(slots.right, slotColor)}</View>}
    </View>
  );
}
