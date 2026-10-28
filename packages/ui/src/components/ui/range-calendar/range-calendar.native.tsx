import {
  isOutOfRange,
  monthTitle,
  monthWeeks,
  nextRange,
  parseISODate,
  sameDay,
  startOfToday,
  toISODate,
  weekdayLabels,
} from '@lib/date';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/field';
import { Text } from '@ui/text';
import type { RangeCalendarProps } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

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
  const ink = useTokenColor(disabled ? 'ink-disabled' : 'ink');
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

  // Touch has no focus to leave, so each pick counts as done with the field.
  const pick = (day: Date) => {
    const next = nextRange(range, toISODate(day), single);
    setOwnValue(next);
    onValueChange?.(next);
    onBlur?.();
  };

  const weeks = monthWeeks(month, weekStartsOn).filter((week) => week.some(Boolean));
  const weekdays = weekdayLabels(weekStartsOn);
  const inRange = (day: Date) => Boolean(start && end && day >= start && day <= end);
  const step = (by: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + by, 1));

  return (
    <View
      accessibilityLabel={field ? field.label : undefined}
      accessibilityHint={field?.hint}
      className="gap-1"
    >
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          disabled={disabled}
          onPress={() => step(-1)}
          className="size-11 items-center justify-center rounded-full active:bg-surface-pressed"
        >
          <ChevronLeft aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
        </Pressable>
        <Text
          accessibilityLiveRegion="polite"
          className="text-[1.375rem] leading-6 font-extrabold uppercase text-ink"
        >
          {monthTitle(month)}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          disabled={disabled}
          onPress={() => step(1)}
          className="size-11 items-center justify-center rounded-full active:bg-surface-pressed"
        >
          <ChevronRight aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
        </Pressable>
      </View>
      <View className="flex-row">
        {weekdays.map((d) => (
          <Text
            key={d.long}
            accessibilityLabel={d.long}
            className="flex-1 pt-1 pb-2 text-center text-sm font-extrabold uppercase text-ink-muted"
          >
            {d.short}
          </Text>
        ))}
      </View>
      {weeks.map((week) => (
        <View key={week.find(Boolean)?.toISOString()} className="flex-row">
          {weekdays.map((weekday, i) => {
            const day = week[i];
            if (!day) return <View key={weekday.long} className="h-11 flex-1" />;
            const isEdge = Boolean(start && end && (sameDay(day, start) || sameDay(day, end)));
            const band = inRange(day);
            const blocked = disabled || isOutOfRange(day, minDate, maxDate);
            const marker = markers.find((m) => m.date === toISODate(day));
            const isToday = sameDay(day, today);
            return (
              <View
                key={day.toISOString()}
                className={clsx(
                  'flex-1 items-center',
                  band && 'bg-brand-subtle',
                  band && (sameDay(day, start) || i === 0) && 'rounded-l-full',
                  band && (sameDay(day, end) || i === 6) && 'rounded-r-full',
                )}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={[dayLabel(day), isToday && 'today', marker?.label]
                    .filter(Boolean)
                    .join(', ')}
                  accessibilityState={{ selected: band, disabled: blocked }}
                  disabled={blocked}
                  onPress={() => pick(day)}
                  className={clsx(
                    'size-11 items-center justify-center rounded-full',
                    isEdge ? 'bg-ink' : 'active:bg-surface-pressed',
                    !isEdge && isToday && 'border-2 border-ink',
                  )}
                >
                  <Text
                    className={clsx(
                      'text-[1.0625rem] font-bold',
                      isEdge
                        ? 'text-on-ink'
                        : blocked
                          ? 'text-ink-disabled'
                          : band
                            ? 'text-brand-ink'
                            : 'text-ink',
                    )}
                    style={{ fontVariant: ['tabular-nums'] }}
                  >
                    {day.getDate()}
                  </Text>
                  {marker && (
                    <View className="absolute bottom-1 size-1.5 rounded-full bg-warning" />
                  )}
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default RangeCalendar;
