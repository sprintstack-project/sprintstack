'use client';

import { Field } from '@base-ui/react/field';
import type { TextAreaProps } from '@ui/types';
import { clsx } from 'clsx';
import { useState } from 'react';

const TextArea = ({
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
}: TextAreaProps) => {
  // Track the text ourselves when uncontrolled, so the counter stays live.
  const [draft, setDraft] = useState(defaultValue ?? '');
  const length = (value ?? draft).length;
  // Past the limit we flag the field instead of truncating (maxLength is not passed to the DOM).
  const over = maxLength !== undefined && length > maxLength;

  return (
    <div
      data-invalid={invalid || over || undefined}
      data-disabled={disabled || undefined}
      className="field flex w-full flex-col gap-2 px-5 pt-4 pb-3"
    >
      <Field.Control
        render={<textarea rows={rows} />}
        id={id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setDraft(next);
          onChange?.(next);
        }}
        placeholder={placeholder}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={invalid || over || undefined}
        className={clsx(
          // Grows with content up to 320px, then scrolls.
          'max-h-80 min-h-24 w-full resize-y bg-transparent text-[1.0625rem] leading-6 text-inherit outline-none [field-sizing:content]',
          'placeholder:text-ink-placeholder disabled:cursor-not-allowed disabled:placeholder:text-ink-disabled',
        )}
      />
      {maxLength !== undefined && (
        <span
          data-over={over || undefined}
          className="self-end text-[0.8125rem] font-semibold tabular-nums text-ink-muted font-stretch-semi-condensed data-over:text-brand-ink"
        >
          {length} / {maxLength}
          <span className="sr-only"> characters</span>
        </span>
      )}
    </div>
  );
};

export default TextArea;
