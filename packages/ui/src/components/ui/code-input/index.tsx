'use client';

import { OTPField } from '@base-ui/react/otp-field';
import type { CodeInputProps } from '@ui/types';
import { clsx } from 'clsx';

/**
 * Base UI's OTP field: one input per digit, with focus moving between them. It links itself to
 * the surrounding Field (label, hint, invalid) and handles paste and one-time-code autofill.
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
  return (
    <OTPField.Root
      id={id}
      length={length}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onChange?.(next)}
      onValueComplete={(next) => onComplete?.(next)}
      disabled={disabled}
      // Moving between digits blurs one input and focuses the next; only leaving the code counts.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onBlur?.();
      }}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
    >
      {Array.from({ length }, (_, index) => (
        <OTPField.Input
          // biome-ignore lint/suspicious/noArrayIndexKey: inputs are positional.
          key={index}
          autoFocus={autoFocus && index === 0}
          // The first input takes the Field's label; the rest say where they are.
          aria-label={index === 0 ? undefined : `Digit ${index + 1} of ${length}`}
          // Base UI sets aria-invalid from the Field; this covers `invalid` without one.
          {...(invalid && !disabled && { 'aria-invalid': true })}
          className={clsx(
            'h-16 w-full min-w-0 rounded-lg border-[1.5px] border-line-strong bg-surface text-center caret-transparent outline-none',
            'font-display text-[1.875rem] leading-none font-extrabold text-ink font-stretch-condensed',
            'aria-invalid:border-brand',
            'not-aria-invalid:focus:border-ink not-aria-invalid:focus:shadow-[0_0_0_1px_var(--color-ink)]',
            'disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-muted disabled:text-ink-disabled',
          )}
        />
      ))}
    </OTPField.Root>
  );
};

export default CodeInput;
