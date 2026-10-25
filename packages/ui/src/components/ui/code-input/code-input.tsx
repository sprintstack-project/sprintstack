'use client';

import { useField } from '@ui/field';
import type { CodeInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { useState } from 'react';

const digitsOnly = (text: string, length: number) => text.replace(/\D/g, '').slice(0, length);

/**
 * One transparent input laid over the digit boxes: typing, paste and one-time-code autofill all
 * land in a single field, and the boxes just show its value.
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
  // The box the next digit goes into (the last one once all are filled).
  const active = Math.min(code.length, length - 1);

  const update = (text: string) => {
    const next = digitsOnly(text, length);
    if (value === undefined) setOwn(next);
    onChange?.(next);
    if (next.length === length && next !== code) onComplete?.(next);
  };

  return (
    <div
      className="relative grid gap-2"
      style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
    >
      {Array.from({ length }, (_, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: boxes are positional.
          key={index}
          aria-hidden
          className={clsx(
            'grid h-16 min-w-0 place-items-center rounded-lg border-[1.5px] bg-surface',
            'font-display text-[1.875rem] leading-none font-extrabold text-ink font-stretch-condensed',
            disabled
              ? 'border-line bg-surface-muted text-ink-disabled'
              : isInvalid
                ? 'border-brand'
                : focused && index === active
                  ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]'
                  : 'border-line-strong',
          )}
        >
          {code[index] ?? ''}
        </span>
      ))}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        // No maxLength: it would cut a pasted "123 456" before the space is stripped.
        // biome-ignore lint/a11y/noAutofocus: the code is the only thing on its screen.
        autoFocus={autoFocus}
        value={code}
        disabled={disabled}
        aria-labelledby={field?.labelId}
        aria-describedby={field?.hintId}
        aria-invalid={isInvalid || undefined}
        onChange={(event) => update(event.target.value)}
        onFocus={(event) => {
          setFocused(true);
          // Keep the caret at the end so typing appends and Backspace removes the last digit.
          const end = event.target.value.length;
          event.target.setSelectionRange(end, end);
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className="absolute inset-0 size-full cursor-text rounded-lg bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default CodeInput;
