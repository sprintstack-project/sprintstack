import { fieldShell, tintSlot } from '@lib/field-shell.native';
import { useTokenColor } from '@lib/use-token-color.native';
import { Button } from '@ui/button';
import { useField } from '@ui/field';
import type { InputProps } from '@ui/types';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
const InputPassword = ({
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  invalid,
  disabled,
  onBlur,
}: InputProps) => {
  const field = useField();
  const [focused, setFocused] = useState(false);
  const slotColor = useTokenColor(disabled ? 'ink-disabled' : 'ink-muted');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      className={fieldShell(
        { focused, invalid: invalid || field?.invalid, disabled },
        'flex-row items-center gap-3 px-5',
      )}
    >
      <TextInput
        nativeID={id}
        value={value}
        defaultValue={defaultValue}
        onChangeText={onChange}
        placeholder={placeholder}
        editable={!disabled}
        secureTextEntry={!showPassword}
        inputMode="text"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
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
      <View className="shrink-0">
        {tintSlot(
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={showPassword ? EyeOff : Eye}
            disabled={disabled}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </Button>,
          slotColor,
        )}
      </View>
    </View>
  );
};

export default InputPassword;
