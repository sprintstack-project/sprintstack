import {
  formatDate,
  isOutOfRange,
  MONTHS_SHORT,
  monthTitle,
  monthWeeks,
  parseISODate,
  sameDay,
  startOfToday,
  toISODate,
  weekdayLabels,
} from '@lib/date';
import { fieldShell } from '@lib/field-shell.native';
import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useTokenColor } from '@lib/use-token-color.native';
import { Button } from '@ui/Button/Button';
import { useField } from '@ui/Field/Field';
import { Caret } from '@ui/Select/Caret';
import type { DatePickerProps } from '@ui/types';
import { clsx } from 'clsx';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function DatePicker({
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
  const field = useField();
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState(defaultValue ?? null);
  const selected = parseISODate(value === undefined ? ownValue : value);
  const today = startOfToday();
  const minDate = parseISODate(min);
  const maxDate = parseISODate(max);
  const [view, setView] = useState(defaultView);
  const [month, setMonth] = useState(selected ?? today);
  const overdue = dueStyle && selected && selected < today;
  const muted = useTokenColor(disabled ? 'ink-disabled' : 'ink-muted');
  const ink = useTokenColor('ink');

  const show = () => {
    setMonth(selected ?? today);
    setView(defaultView);
    setOpen(true);
    sheet.current?.show();
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: only on mount
  useEffect(() => {
    if (defaultOpen) show();
  }, []);

  const commit = (date: Date | null) => {
    const next = date ? toISODate(date) : null;
    setOwnValue(next);
    onValueChange?.(next);
    sheet.current?.hide();
  };
  const step = (dir: 1 | -1) =>
    setMonth(
      view === 'days'
        ? new Date(month.getFullYear(), month.getMonth() + dir, 1)
        : new Date(month.getFullYear() + dir, month.getMonth(), 1),
    );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          field ? `${field.label}, ${selected ? formatDate(selected) : placeholder}` : undefined
        }
        accessibilityHint={overdue ? 'Overdue' : field?.hint}
        accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
        disabled={disabled}
        onPress={show}
        className={fieldShell(
          { focused: open, invalid: invalid || field?.invalid, disabled },
          'flex-row items-center gap-3 px-5',
        )}
      >
        <Calendar aria-hidden size={scaled(24)} strokeWidth={2} color={muted} />
        <Text
          numberOfLines={1}
          className={clsx(
            'min-w-0 flex-1 text-[1.0625rem]',
            disabled ? 'text-ink-disabled' : selected ? 'text-ink' : 'text-ink-placeholder',
          )}
        >
          {selected ? formatDate(selected) : placeholder}
          {overdue && <Text className="font-bold text-brand-ink"> · Overdue</Text>}
        </Text>
        <Caret open={open} disabled={disabled} />
      </Pressable>

      <Sheet
        sheetRef={sheet}
        onClose={() => {
          setOpen(false);
          onBlur?.();
        }}
      >
        <View className="flex-row items-center justify-between px-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              view === 'days'
                ? `${monthTitle(month)}, choose a month`
                : `${month.getFullYear()}, back to days`
            }
            onPress={() => setView(view === 'days' ? 'months' : 'days')}
            className="rounded-full px-2.5 py-1.5 active:bg-surface-pressed"
          >
            <Text className="text-[1.375rem] leading-6 font-extrabold uppercase text-ink">
              {view === 'days' ? monthTitle(month) : month.getFullYear()}
            </Text>
          </Pressable>
          <View className="flex-row">
            {([-1, 1] as const).map((dir) => (
              <Pressable
                key={dir}
                accessibilityRole="button"
                accessibilityLabel={`${dir === 1 ? 'Next' : 'Previous'} ${view === 'days' ? 'month' : 'year'}`}
                onPress={() => step(dir)}
                className="size-11 items-center justify-center rounded-full active:bg-surface-pressed"
              >
                {dir === 1 ? (
                  <ChevronRight aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
                ) : (
                  <ChevronLeft aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {view === 'days' ? (
          <View className="gap-1">
            <View className="flex-row">
              {weekdayLabels(weekStartsOn).map((d) => (
                <Text
                  key={d.long}
                  accessibilityLabel={d.long}
                  className="flex-1 pt-1 pb-2 text-center text-sm font-extrabold text-ink-muted"
                >
                  {d.short}
                </Text>
              ))}
            </View>
            {monthWeeks(month, weekStartsOn).map((week) => (
              <View key={week.find(Boolean)?.toISOString()} className="flex-row">
                {week.map((day, i) => (
                  <View key={day ? day.getDate() : `empty-${i}`} className="flex-1 items-center">
                    {day && (
                      <Day
                        day={day}
                        today={sameDay(day, today)}
                        selected={sameDay(day, selected)}
                        disabled={isOutOfRange(day, minDate, maxDate)}
                        onPress={() => commit(day)}
                      />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-y-2">
            {MONTHS_SHORT.map((name, m) => {
              const isSelected =
                selected?.getFullYear() === month.getFullYear() && selected.getMonth() === m;
              return (
                <View key={name} className="w-1/4 px-1">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setMonth(new Date(month.getFullYear(), m, 1));
                      setView('days');
                    }}
                    className={clsx(
                      'h-12 items-center justify-center rounded-full',
                      isSelected ? 'bg-brand' : 'bg-surface-muted active:bg-surface-pressed',
                    )}
                  >
                    <Text
                      className={clsx(
                        'text-[1.0625rem] font-extrabold',
                        isSelected ? 'text-on-brand' : 'text-ink',
                      )}
                    >
                      {name}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        <View className="mt-2 flex-row items-center justify-between border-t border-line px-1 pt-3">
          <Button variant="link" onClick={() => commit(null)}>
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isOutOfRange(today, minDate, maxDate)}
            onClick={() => commit(today)}
          >
            Today
          </Button>
        </View>
      </Sheet>
    </>
  );
}

/** A round 44px day: today is ringed in ink, the selection filled red, so the two can't be confused. */
function Day({
  day,
  today,
  selected,
  disabled,
  onPress,
}: {
  day: Date;
  today: boolean;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatDate(day)}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={clsx(
        'size-11 items-center justify-center rounded-full',
        selected ? 'bg-brand' : today ? 'border-2 border-ink' : 'active:bg-surface-pressed',
      )}
    >
      <Text
        className={clsx(
          'text-[1.0625rem] font-bold',
          selected ? 'text-on-brand' : disabled ? 'text-ink-disabled' : 'text-ink',
        )}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {day.getDate()}
      </Text>
    </Pressable>
  );
}
