import { NumberField } from '@base-ui/react/number-field';
import type { NumberInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const stepper = clsx(
  'grid w-16 shrink-0 cursor-pointer place-items-center text-ink',
  'hover:bg-surface-hover active:bg-surface-pressed',
  'disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
  'focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-focus-ring',
);

const outOfRange = (n: number | null | undefined, min?: number, max?: number) =>
  n != null && ((min !== undefined && n < min) || (max !== undefined && n > max));

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
export function NumberInput({
  id,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  unit,
  placeholder,
  invalid,
  disabled,
  onBlur,
}: NumberInputProps) {
  const [draft, setDraft] = useState(defaultValue ?? null);
  // Out-of-range typed values stay as typed and are flagged; the Field error states the range.
  const over = outOfRange(value === undefined ? draft : value, min, max);

  return (
    <NumberField.Root
      id={id}
      value={value}
      defaultValue={defaultValue ?? undefined}
      onValueChange={(next) => {
        setDraft(next);
        onValueChange?.(next);
      }}
      min={min}
      max={max}
      step={step}
      allowOutOfRange
      disabled={disabled}
    >
      <NumberField.Group
        data-invalid={invalid || over || undefined}
        className="field flex w-full items-stretch overflow-hidden"
      >
        <NumberField.Decrement className={clsx(stepper, 'border-r-[1.5px] border-line-strong')}>
          <Minus aria-hidden strokeWidth={2} className="size-6" />
        </NumberField.Decrement>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2">
          <NumberField.Input
            placeholder={placeholder}
            onBlur={onBlur}
            aria-invalid={invalid || over || undefined}
            className={clsx(
              'min-w-0 bg-transparent text-lg tabular-nums text-inherit outline-none',
              'placeholder:text-ink-placeholder disabled:cursor-not-allowed',
              // With a unit, the input hugs its digits so value and unit centre together.
              unit ? 'field-sizing-content max-w-24 min-w-[2ch] text-right' : 'w-full text-center',
            )}
          />
          {unit && <span className="shrink-0 text-lg text-ink-muted">{unit}</span>}
        </div>
        <NumberField.Increment className={clsx(stepper, 'border-l-[1.5px] border-line-strong')}>
          <Plus aria-hidden strokeWidth={2} className="size-6" />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
