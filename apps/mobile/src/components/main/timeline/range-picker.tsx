import { parseISODate, toISODate } from '@lib/date';
import { scaled, touchSlop } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import RangeCalendar from '@ui/range-calendar';
import Text from '@ui/text';
import type { DateRange } from '@ui/types';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { datesOf, type Range, rangeLabel } from './data';

const toDraft = ({ start, end }: Range): DateRange => ({
  start: toISODate(start),
  end: toISODate(end),
});

interface RangePickerProps {
  value: Range;
  onValueChange: (range: Range) => void;
}

export const RangePicker = ({ value, onValueChange }: RangePickerProps) => {
  const muted = useTokenColor('ink-muted');
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | null>(() => toDraft(value));
  // A fresh calendar each time, so it opens on the range's first month.
  const [opens, setOpens] = useState(0);

  const show = () => {
    // Closing halfway through a pick leaves the range as it was.
    setDraft(toDraft(value));
    setOpens((n) => n + 1);
    setOpen(true);
    sheet.current?.show();
  };

  // The first day pressed only starts a range, so the chart waits for the second.
  const pick = (next: DateRange | null) => {
    setDraft(next);
    if (!next || next.start === next.end) return;
    const start = parseISODate(next.start);
    const end = parseISODate(next.end);
    if (!start || !end) return;
    onValueChange({ start, end });
    sheet.current?.hide();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Date range, ${rangeLabel(value)}`}
        accessibilityState={{ expanded: open }}
        hitSlop={touchSlop(48)}
        onPress={show}
        className="h-12 flex-row items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 active:bg-surface-pressed"
      >
        <Calendar aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
        <Text className="text-[1.0625rem] leading-5 font-bold text-ink">{datesOf(value)}</Text>
        <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
      </Pressable>
      <Sheet sheetRef={sheet} title="Date range" onClose={() => setOpen(false)}>
        <RangeCalendar key={opens} value={draft} onValueChange={pick} />
      </Sheet>
    </>
  );
};
