'use client';

import type { HeadlineInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { TriangleAlert } from 'lucide-react';
import { useId, useImperativeHandle, useRef, useState } from 'react';

const HeadlineInput = ({
  id,
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  error,
  autoFocus,
  disabled,
  ref,
}: HeadlineInputProps) => {
  const input = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }), []);
  const [ownValue, setOwnValue] = useState(defaultValue ?? '');
  const errorId = useId();

  return (
    <div className={clsx('flex flex-col gap-4', error && '-ml-6 border-l-4 border-brand pl-5')}>
      <textarea
        ref={input}
        id={id}
        aria-label={label}
        rows={1}
        // biome-ignore lint/a11y/noAutofocus: only when the screen opens to write it
        autoFocus={autoFocus}
        disabled={disabled}
        value={value ?? ownValue}
        onChange={(e) => {
          const next = e.target.value.replace(/\n/g, ' ');
          setOwnValue(next);
          onChange?.(next);
        }}
        onKeyDown={(e) => {
          // ⌘↵ / Ctrl+↵ is left to bubble (e.g. to submit); a plain Enter would add a line break.
          if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) e.preventDefault();
        }}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          'field-sizing-content w-full resize-none rounded-md bg-transparent px-2 py-4 font-display text-[1.5rem] leading-[1.05] font-extrabold text-ink font-stretch-condensed md:text-[2.75rem]',
          'placeholder:text-ink-placeholder disabled:cursor-not-allowed disabled:text-ink-disabled',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring',
        )}
      />
      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1.5 text-meta font-bold text-brand-ink font-stretch-semi-condensed"
        >
          <TriangleAlert aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default HeadlineInput;
