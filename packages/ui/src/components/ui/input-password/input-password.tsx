import { Input as BaseInput } from '@base-ui/react/input';
import { twMerge } from '@lib/tw-merge';
import { Button } from '@ui/button';
import type { InputProps } from '@ui/types';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

// Slots inherit the muted icon colour; buttons placed in them set their own.
const slot = 'flex shrink-0 items-center text-ink-muted';

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
const InputPassword = ({
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  invalid,
  disabled,
  onBlur,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={twMerge(clsx('field flex w-full items-center gap-3 pr-1.5 pl-5'))}
    >
      <BaseInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        onValueChange={(next) => onChange?.(next)}
        placeholder={placeholder}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={clsx(
          // self-stretch fills the shell; a height would disable stretching.
          'min-w-0 flex-1 self-stretch bg-transparent text-[1.0625rem] leading-6 text-inherit outline-none',
          'placeholder:text-ink-placeholder disabled:cursor-not-allowed disabled:placeholder:text-ink-disabled',
        )}
      />
      <span className={slot}>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          icon={showPassword ? EyeOff : Eye}
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide password' : 'Show password'}
        </Button>
      </span>
    </div>
  );
};

export default InputPassword;
