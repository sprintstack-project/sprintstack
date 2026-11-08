'use client';

import { Popover } from '@base-ui/react/popover';
import { parseISODate, toISODate } from '@lib/date';
import { usePortalContainer } from '@lib/portal-container';
import RangeCalendar from '@ui/range-calendar';
import { popupFrame } from '@ui/select/menu';
import type { DateRange } from '@ui/types';
import { clsx } from 'clsx';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { type Range, rangeLabel } from './data';

interface RangePickerProps {
  value: Range;
  onValueChange: (range: Range) => void;
}

const RangePicker = ({ value, onValueChange }: RangePickerProps) => {
  const container = usePortalContainer();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | null>(null);
  const label = rangeLabel(value);

  // The first day pressed only starts a range, so the chart waits for the second.
  const pick = (next: DateRange | null) => {
    setDraft(next);
    if (!next || next.start === next.end) return;
    const start = parseISODate(next.start);
    const end = parseISODate(next.end);
    if (!start || !end) return;
    onValueChange({ start, end });
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Closing halfway through a pick leaves the range as it was.
        if (next) setDraft({ start: toISODate(value.start), end: toISODate(value.end) });
      }}
    >
      <Popover.Trigger
        aria-label={`Date range, ${label}`}
        className="kbd-focus inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-[1.0625rem] leading-5 font-bold whitespace-nowrap text-ink font-stretch-semi-condensed transition-colors duration-120 hover:bg-surface-hover data-popup-open:border-ink"
      >
        <Calendar aria-hidden strokeWidth={2} className="size-5 shrink-0 text-ink-muted" />
        {label}
        <ChevronDown
          aria-hidden
          strokeWidth={2}
          className="size-5 shrink-0 text-ink-muted in-data-popup-open:rotate-180"
        />
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} align="start" className="z-50 outline-none">
          <Popover.Popup
            aria-label="Choose a date range"
            className={clsx(
              popupFrame,
              'max-h-(--available-height) w-90 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl p-5',
            )}
          >
            <RangeCalendar value={draft} onValueChange={pick} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default RangePicker;
