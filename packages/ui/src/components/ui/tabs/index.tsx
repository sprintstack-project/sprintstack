'use client';

import { useField } from '@ui/field';
import type { TabsProps } from '@ui/types';
import { clsx } from 'clsx';

const Tabs = <V extends string>({ label, choices, value, onValueChange, onBlur }: TabsProps<V>) => {
  const field = useField();
  return (
    <fieldset
      {...(field
        ? { 'aria-labelledby': field.labelId, 'aria-describedby': field.hintId }
        : { 'aria-label': label })}
      className={clsx(
        'm-0 flex shrink-0 rounded-full border-0 bg-surface-muted p-1',
        // In a Field's column it keeps its own width and scrolls on narrow screens.
        field && 'max-w-full self-start overflow-x-auto',
      )}
    >
      {choices.map(({ value: choice, label, ariaLabel, icon: Icon }) => (
        <button
          key={choice}
          type="button"
          aria-label={ariaLabel}
          aria-pressed={value === choice}
          // A pick is a complete answer, so it also counts as leaving the field.
          onClick={() => {
            onValueChange(choice);
            onBlur?.();
          }}
          className={clsx(
            'kbd-focus inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[1.0625rem] leading-5 font-extrabold whitespace-nowrap font-stretch-condensed transition-colors duration-120',
            value === choice ? 'bg-ink text-on-ink' : 'text-ink hover:bg-surface-hover',
          )}
        >
          {Icon && <Icon aria-hidden strokeWidth={2} className="size-5" />}
          {label}
        </button>
      ))}
    </fieldset>
  );
};

export default Tabs;
