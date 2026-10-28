'use client';

import { monthTitle, nextRange, parseISODate, startOfToday, toISODate } from '@lib/date';
import { useField } from '@ui/field';
import type { RangeCalendarProps } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type FocusEvent, useState } from 'react';
import { DayPicker } from 'react-day-picker';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';
const navButton = clsx(
  'grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
  focus,
);

// The band runs behind the days in the range; its ends are ink circles.
const edge = '[&>button]:bg-ink [&>button]:text-on-ink [&>button]:hover:bg-ink bg-brand-subtle';

const dayLabel = (date: Date) =>
  date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const RangeCalendar = ({
  value,
  defaultValue,
  onValueChange,
  single,
  min,
  max,
  weekStartsOn = 1,
  markers = [],
  disabled,
  onBlur,
}: RangeCalendarProps) => {
  const field = useField();
  const [ownValue, setOwnValue] = useState(defaultValue ?? null);
  const range = value === undefined ? ownValue : value;
  const start = parseISODate(range?.start);
  const end = parseISODate(range?.end);
  const today = startOfToday();
  const minDate = parseISODate(min);
  const maxDate = parseISODate(max);
  const [month, setMonth] = useState(() => {
    const shown = start ?? today;
    return new Date(shown.getFullYear(), shown.getMonth(), 1);
  });

  const marked = markers.flatMap((m) => parseISODate(m.date) ?? []);
  const markerOn = (date: Date) => markers.find((m) => m.date === toISODate(date));

  const pick = (day: Date) => {
    const next = nextRange(range, toISODate(day), single);
    setOwnValue(next);
    onValueChange?.(next);
  };

  const step = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));

  // Blurs once focus leaves the whole calendar, not when it moves between days.
  const blur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) onBlur?.();
  };

  return (
    <fieldset
      aria-labelledby={field?.labelId}
      aria-describedby={field?.hintId}
      onBlur={blur}
      className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={disabled}
          onClick={() => step(-1)}
          className={navButton}
        >
          <ChevronLeft aria-hidden strokeWidth={2} className="size-6" />
        </button>
        <p aria-live="polite" className="headline text-[1.375rem] leading-none text-ink">
          {monthTitle(month)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          disabled={disabled}
          onClick={() => step(1)}
          className={navButton}
        >
          <ChevronRight aria-hidden strokeWidth={2} className="size-6" />
        </button>
      </div>
      <DayPicker
        mode="range"
        selected={start ? { from: start, to: end } : undefined}
        // The picker's own range rules differ from ours, so only the day pressed is used.
        onSelect={(_, day) => pick(day)}
        month={month}
        onMonthChange={setMonth}
        weekStartsOn={weekStartsOn}
        disabled={
          disabled || [
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : []),
          ]
        }
        today={today}
        hideNavigation
        modifiers={{ marked }}
        labels={{
          labelDayButton: (date, modifiers) => {
            const marker = markerOn(date);
            return [
              dayLabel(date),
              modifiers.today && 'today',
              marker?.label,
              modifiers.range_start && 'start',
              modifiers.range_end && 'end',
              modifiers.range_middle && 'selected',
            ]
              .filter(Boolean)
              .join(', ');
          },
        }}
        classNames={{
          months: 'w-full',
          month: 'w-full',
          month_caption: 'sr-only',
          month_grid: 'w-full border-separate border-spacing-y-1',
          weekday:
            'pb-2 font-display text-sm font-extrabold text-ink-muted uppercase font-stretch-condensed',
          day: 'p-0 text-center',
          day_button: clsx(
            'relative mx-auto grid size-11 cursor-pointer place-items-center rounded-full text-[1.0625rem] leading-5 font-bold tabular-nums text-ink font-stretch-semi-condensed hover:bg-surface-hover',
            'disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
            focus,
          ),
          // Today is a ring, so it stays visible inside the band.
          today: '[&>button]:shadow-[inset_0_0_0_2px_var(--color-ink)]',
          range_middle:
            'bg-brand-subtle first:rounded-l-full last:rounded-r-full [&>button]:text-brand-ink [&>button]:hover:bg-transparent',
          range_start: clsx('rounded-l-full', edge),
          range_end: clsx('rounded-r-full', edge),
          outside: 'invisible',
        }}
        modifiersClassNames={{
          marked:
            "[&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:size-1.5 [&>button]:after:rounded-full [&>button]:after:bg-warning [&>button]:after:content-['']",
        }}
      />
    </fieldset>
  );
};

export default RangeCalendar;
