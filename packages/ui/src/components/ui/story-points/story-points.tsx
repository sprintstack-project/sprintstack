'use client';

import SelectWithTrigger from '@ui/select/select';
import type { Option, StoryPointsProps } from '@ui/types';
import { clsx } from 'clsx';
import { CircleAlert, Ellipsis } from 'lucide-react';
import { useId, useState } from 'react';

const DEFAULT_SCALE = [1, 2, 3, 5, 8, 13];
const DEFAULT_MORE = [0, 21, 34];

const toggle = clsx(
  'grid h-11 min-w-0 flex-1 cursor-pointer place-items-center rounded-lg text-[1.0625rem] leading-5 font-extrabold text-ink tabular-nums font-stretch-condensed',
  'not-disabled:hover:bg-surface-hover aria-pressed:bg-ink aria-pressed:text-on-ink not-disabled:aria-pressed:hover:bg-ink',
  'disabled:cursor-not-allowed disabled:text-ink-disabled',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
);

const StoryPoints = ({
  label = 'Story points',
  value,
  defaultValue,
  onValueChange,
  onBlur,
  scale = DEFAULT_SCALE,
  more = DEFAULT_MORE,
  error,
  disabled,
}: StoryPointsProps) => {
  const [ownValue, setOwnValue] = useState(defaultValue ?? null);
  const points = value === undefined ? ownValue : value;
  const inMore = points !== null && more.includes(points);
  const errorId = useId();

  // A pick is a complete answer, so it also counts as leaving the field.
  const set = (next: number | null) => {
    setOwnValue(next);
    onValueChange?.(next);
    onBlur?.();
  };

  const moreOptions: Option<number>[] = [
    ...more.map((n) => ({ value: n, label: `${n} points` })),
    ...(points === null ? [] : [{ value: -1, label: 'No estimate', action: () => set(null) }]),
  ];

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={error ? errorId : undefined}
      className="flex min-w-0 flex-col gap-2"
    >
      <legend className="mb-2 text-[1.0625rem] leading-5.5 font-bold text-ink font-stretch-semi-condensed">
        {label}
      </legend>
      <div
        className={clsx('flex gap-1 rounded-xl bg-surface-muted p-1', error && 'ring-2 ring-brand')}
      >
        {scale.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={points === n}
            disabled={disabled}
            onClick={() => set(points === n ? null : n)}
            className={toggle}
          >
            {n}
          </button>
        ))}
        <SelectWithTrigger<number>
          options={moreOptions}
          value={inMore ? points : null}
          onValueChange={(next) => next !== null && set(next)}
          disabled={disabled}
          trigger={{
            label: inMore ? `More story points, ${points} selected` : 'More story points',
            align: 'end',
            className: clsx(toggle, inMore && 'bg-ink text-on-ink hover:bg-ink'),
            children: inMore ? points : <Ellipsis aria-hidden strokeWidth={2} className="size-5" />,
          }}
        />
      </div>
      {error && (
        <span
          id={errorId}
          className="flex items-center gap-1 text-meta font-bold text-brand-ink font-stretch-semi-condensed"
        >
          <CircleAlert aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
          {error}
        </span>
      )}
    </fieldset>
  );
};

export default StoryPoints;
