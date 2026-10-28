import { clsx } from 'clsx';
import { CalendarOff, Plane, Thermometer } from 'lucide-react';
import { spanLabel, type TimeOff, type TimeOffType, TYPE_LABEL } from './data';

/** Chip fill and text, the bar's outline (with its thicker left edge), and the legend swatch. */
export const TONES: Record<TimeOffType, { chip: string; bar: string; swatch: string }> = {
  vacation: {
    chip: 'bg-brand-subtle text-brand-ink',
    bar: 'border-brand bg-brand-subtle text-brand-ink',
    swatch: 'border-brand bg-brand-subtle',
  },
  sick: {
    chip: 'bg-warning-subtle text-warning-ink',
    bar: 'border-warning bg-warning-subtle text-warning-ink',
    swatch: 'border-warning bg-warning-subtle',
  },
  half: {
    chip: 'bg-info-subtle text-info-ink',
    bar: 'border-info bg-info-subtle text-info-ink',
    swatch: 'border-info bg-info-subtle',
  },
  other: {
    chip: 'bg-review-subtle text-review-ink',
    bar: 'border-review bg-review-subtle text-review-ink',
    swatch: 'border-review bg-review-subtle',
  },
};

export const TYPE_ICON = { vacation: Plane, sick: Thermometer, other: CalendarOff };

/** Diagonal stripes for public holidays. */
export const hatch =
  'bg-[repeating-linear-gradient(135deg,var(--color-line-strong)_0_1px,transparent_1px_0.5rem)]';

/** "22–23 Oct · Vacation". */
export const TimeOffChip = ({ entry }: { entry: TimeOff }) => (
  <span
    className={clsx(
      'inline-flex h-8 items-center rounded-full px-3 text-meta font-bold whitespace-nowrap font-stretch-semi-condensed',
      TONES[entry.type].chip,
    )}
  >
    {spanLabel(entry)} · {TYPE_LABEL[entry.type]}
  </span>
);
