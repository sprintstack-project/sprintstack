'use client';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { CheckboxProps } from '@ui/types';
import { Check, CircleAlert } from 'lucide-react';
import { useId } from 'react';

const Checkbox = ({
  id,
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  error,
  disabled,
}: CheckboxProps) => {
  const fallbackId = useId();
  const labelId = `${id ?? fallbackId}-label`;
  const errorId = `${id ?? fallbackId}-error`;
  return (
    <div className="flex items-start gap-3">
      <BaseCheckbox.Root
        id={id ?? fallbackId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(next) => onCheckedChange?.(next)}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={[
          'mt-px grid size-5.5 shrink-0 cursor-pointer place-items-center rounded-sm border-[1.5px] border-line-strong bg-surface text-on-ink',
          'not-data-disabled:hover:border-ink data-checked:border-ink data-checked:bg-ink',
          'aria-invalid:border-brand data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:bg-surface-muted',
          'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring',
        ].join(' ')}
      >
        <BaseCheckbox.Indicator>
          <Check aria-hidden strokeWidth={3} className="size-4" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <div className="flex flex-col gap-1">
        <label
          id={labelId}
          htmlFor={id ?? fallbackId}
          className="cursor-pointer text-body font-semibold font-stretch-semi-condensed text-ink"
        >
          {children}
        </label>
        {error && (
          <span
            id={errorId}
            className="flex items-center gap-1 text-meta font-bold font-stretch-semi-condensed text-brand-ink"
          >
            <CircleAlert aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
