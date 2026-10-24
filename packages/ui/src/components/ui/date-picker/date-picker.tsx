'use client';

import { Popover } from '@base-ui/react/popover';
import {
  formatDate,
  isOutOfRange,
  MONTHS_SHORT,
  monthTitle,
  parseISODate,
  startOfToday,
  toISODate,
} from '@lib/date';
import { usePortalContainer } from '@lib/portal-container';
import { Button } from '@ui/button';
import { useField } from '@ui/field';
import { Caret } from '@ui/select/caret';
import { popupFrame } from '@ui/select/menu';
import type { DatePickerProps } from '@ui/types';
import { clsx } from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useState } from 'react';
import { DayPicker } from 'react-day-picker';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';
const navButton = clsx(
  'grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover',
  focus,
);

export function DatePicker({
  id,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date',
  min,
  max,
  weekStartsOn = 1,
  dueStyle,
  defaultView = 'days',
  defaultOpen,
  invalid,
  disabled,
  onBlur,
}: DatePickerProps) {
  const container = usePortalContainer();
  const field = useField();
  const valueId = useId();
  const [ownValue, setOwnValue] = useState(defaultValue ?? null);
  const iso = value === undefined ? ownValue : value;
  const selected = parseISODate(iso);
  const today = startOfToday();
  const minDate = parseISODate(min);
  const maxDate = parseISODate(max);

  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [view, setView] = useState(defaultView);
  const [month, setMonth] = useState(selected ?? today);
  const overdue = dueStyle && selected && selected < today;

  const commit = (date: Date | null) => {
    const next = date ? toISODate(date) : null;
    setOwnValue(next);
    onValueChange?.(next);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
        if (next) {
          setMonth(selected ?? today);
          setView(defaultView);
        }
      }}
    >
      <Popover.Trigger
        id={id}
        disabled={disabled}
        // Name it "<label>, <date>" so the current value is read with the label.
        aria-labelledby={field ? `${field.labelId} ${valueId}` : undefined}
        aria-describedby={field?.hintId}
        aria-invalid={invalid || field?.invalid || undefined}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
        className="field flex w-full cursor-pointer items-center gap-3 px-5 text-left text-[1.0625rem] leading-6 focus-visible:outline-none data-disabled:cursor-not-allowed"
      >
        <Calendar aria-hidden strokeWidth={2} className="size-6 shrink-0 text-ink-muted" />
        <span
          id={valueId}
          className={clsx('min-w-0 flex-1 truncate', !selected && 'text-ink-placeholder')}
        >
          {selected ? formatDate(selected) : placeholder}
          {/* Past due dates say so in words, in red. */}
          {overdue && (
            <>
              {' '}
              <span className="font-bold text-brand-ink">· Overdue</span>
            </>
          )}
        </span>
        <span className="flex in-data-popup-open:rotate-180">
          <Caret />
        </span>
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} align="start" className="z-50 outline-none">
          <Popover.Popup
            aria-label="Choose a date"
            // popupFrame, not popup: the menu height cap would cut off a 6-week month.
            className={clsx(
              popupFrame,
              'max-h-(--available-height) w-[22.5rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl p-5',
            )}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setView(view === 'days' ? 'months' : 'days')}
                aria-label={
                  view === 'days'
                    ? `${monthTitle(month)}, choose a month`
                    : `${month.getFullYear()}, back to days`
                }
                className={clsx(
                  'headline cursor-pointer rounded-full px-2.5 py-1.5 text-[1.375rem] leading-none text-ink hover:bg-surface-hover',
                  focus,
                )}
              >
                {view === 'days' ? monthTitle(month) : month.getFullYear()}
              </button>
              <div className="flex">
                <button
                  type="button"
                  aria-label={view === 'days' ? 'Previous month' : 'Previous year'}
                  onClick={() =>
                    setMonth(
                      new Date(
                        month.getFullYear() - (view === 'days' ? 0 : 1),
                        month.getMonth() - (view === 'days' ? 1 : 0),
                        1,
                      ),
                    )
                  }
                  className={navButton}
                >
                  <ChevronLeft aria-hidden strokeWidth={2} className="size-6" />
                </button>
                <button
                  type="button"
                  aria-label={view === 'days' ? 'Next month' : 'Next year'}
                  onClick={() =>
                    setMonth(
                      new Date(
                        month.getFullYear() + (view === 'days' ? 0 : 1),
                        month.getMonth() + (view === 'days' ? 1 : 0),
                        1,
                      ),
                    )
                  }
                  className={navButton}
                >
                  <ChevronRight aria-hidden strokeWidth={2} className="size-6" />
                </button>
              </div>
            </div>

            {view === 'days' ? (
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(date) => {
                  if (!date) return;
                  commit(date);
                  setOpen(false);
                }}
                month={month}
                onMonthChange={setMonth}
                weekStartsOn={weekStartsOn}
                disabled={[
                  ...(minDate ? [{ before: minDate }] : []),
                  ...(maxDate ? [{ after: maxDate }] : []),
                ]}
                today={today}
                hideNavigation
                // Always 6 weeks so the popup keeps one height; outside days render invisible.
                showOutsideDays
                fixedWeeks
                autoFocus
                classNames={{
                  months: 'w-full',
                  month: 'w-full',
                  month_caption: 'sr-only',
                  month_grid: 'w-full border-separate border-spacing-y-1',
                  weekday:
                    'pb-2 font-display text-sm font-extrabold text-ink-muted font-stretch-condensed',
                  day: 'p-0 text-center',
                  day_button: clsx(
                    'mx-auto grid size-11 cursor-pointer place-items-center rounded-full text-[1.0625rem] leading-5 font-bold tabular-nums text-ink font-stretch-semi-condensed hover:bg-surface-hover',
                    'disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
                    focus,
                  ),
                  // Today is a ring, the selection a red fill, so the two can't be confused.
                  today: '[&>button]:shadow-[inset_0_0_0_2px_var(--color-ink)]',
                  selected:
                    '[&>button]:bg-brand [&>button]:text-on-brand [&>button]:shadow-none [&>button]:hover:bg-brand-hover',
                  outside: 'invisible',
                }}
              />
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {MONTHS_SHORT.map((name, m) => {
                  const pill = new Date(month.getFullYear(), m, 1);
                  const isSelected =
                    selected?.getFullYear() === month.getFullYear() && selected.getMonth() === m;
                  const blocked = isOutOfRange(
                    pill,
                    minDate && new Date(minDate.getFullYear(), minDate.getMonth(), 1),
                    maxDate,
                  );
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={blocked}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setMonth(pill);
                        setView('days');
                      }}
                      className={clsx(
                        'h-12 cursor-pointer rounded-full text-[1.0625rem] font-extrabold font-stretch-condensed',
                        isSelected
                          ? 'bg-brand text-on-brand'
                          : 'bg-surface-muted text-ink hover:bg-surface-pressed',
                        'disabled:cursor-not-allowed disabled:text-ink-disabled',
                        focus,
                      )}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <Button
                variant="link"
                onClick={() => {
                  commit(null);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isOutOfRange(today, minDate, maxDate)}
                onClick={() => {
                  commit(today);
                  setOpen(false);
                }}
              >
                Today
              </Button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
