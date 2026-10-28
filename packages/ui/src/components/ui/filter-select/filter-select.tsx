'use client';

import { STATUS_LABEL } from '@lib/status';
import { optionText } from '@ui/select/option-content';
import Select from '@ui/select/select';
import type { FilterSelectProps } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FilterSelect = <V = string>({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'All',
  count,
  block,
  disabled,
}: FilterSelectProps<V>) => {
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const selected = options.find((o) => o.value === current);

  return (
    <Select<V>
      options={options}
      value={current}
      onValueChange={(next) => {
        setOwnValue(next);
        onValueChange?.(next);
      }}
      disabled={disabled}
      trigger={{
        label,
        align: 'start',
        className: clsx(
          'inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5',
          'text-[1.0625rem] leading-5 whitespace-nowrap text-ink font-stretch-semi-condensed',
          'transition-colors duration-120 hover:bg-surface-hover data-popup-open:border-ink',
          'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring',
          'data-disabled:cursor-not-allowed data-disabled:text-ink-disabled',
          block && 'w-full',
        ),
        children: (
          <>
            <span className="font-semibold text-ink-muted">{label}</span>
            <span className={clsx('truncate font-bold', block && 'flex-1 text-left')}>
              {selected ? optionText(selected, (tone) => STATUS_LABEL[tone]) : placeholder}
            </span>
            {count !== undefined && (
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-[0.8125rem] font-extrabold text-on-ink tabular-nums">
                {count}
              </span>
            )}
            <ChevronDown
              aria-hidden
              strokeWidth={2}
              className="size-5 shrink-0 text-ink-muted in-data-popup-open:rotate-180"
            />
          </>
        ),
      }}
    />
  );
};

export default FilterSelect;
