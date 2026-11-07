import { Input as BaseInput } from '@base-ui/react/input';
import { twMerge } from '@lib/tw-merge';
import type { InputProps } from '@ui/types';
import { clsx } from 'clsx';

// Slots inherit the muted icon colour; buttons placed in them set their own.
const slot = 'flex shrink-0 items-center text-ink-muted';

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
const Input = ({
  id,
  value,
  defaultValue,
  onChange,
  placeholder,
  type = 'text',
  slots,
  pill,
  autoComplete,
  invalid,
  disabled,
  onBlur,
}: InputProps) => {
  return (
    <div
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={twMerge(
        clsx(
          'field flex w-full items-center gap-3 px-5',
          // Search bar: full pill, with the trailing button tucked against the edge.
          pill && 'rounded-full!',
          pill && slots?.right && 'pr-1.5',
        ),
      )}
    >
      {slots?.left && <span className={slot}>{slots.left}</span>}
      <BaseInput
        id={id}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => onChange?.(next)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={clsx(
          // self-stretch fills the shell; a height would disable stretching.
          'min-w-0 flex-1 self-stretch bg-transparent text-[1.0625rem] leading-6 text-inherit outline-none',
          'placeholder:text-ink-placeholder disabled:cursor-not-allowed disabled:placeholder:text-ink-disabled',
        )}
      />
      {slots?.right && <span className={slot}>{slots.right}</span>}
    </div>
  );
};

export default Input;
