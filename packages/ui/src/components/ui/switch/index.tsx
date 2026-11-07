'use client';

import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { SwitchProps } from '@ui/types';
import { clsx } from 'clsx';

const Switch = ({ id, label, checked, defaultChecked, onCheckedChange, disabled }: SwitchProps) => (
  <BaseSwitch.Root
    id={id}
    aria-label={label}
    checked={checked}
    defaultChecked={defaultChecked}
    onCheckedChange={(next) => onCheckedChange?.(next)}
    disabled={disabled}
    className={clsx(
      'inline-flex h-10 w-18 shrink-0 cursor-pointer items-center rounded-full border-[1.5px] border-line-strong bg-surface-muted p-1 transition-colors duration-120',
      'not-data-disabled:hover:border-ink data-checked:border-brand data-checked:bg-brand',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
      'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring',
    )}
  >
    <BaseSwitch.Thumb
      className={clsx(
        'size-7 rounded-full bg-ink-muted transition-[translate,background-color] duration-120 motion-reduce:transition-none',
        'data-checked:translate-x-8 data-checked:bg-on-brand',
      )}
    />
  </BaseSwitch.Root>
);

export default Switch;
