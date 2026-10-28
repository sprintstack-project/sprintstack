import type { Option, StatusTone } from '@ui/types';
import {
  addDays,
  differenceInCalendarDays,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  format,
  max,
} from 'date-fns';
import type { Person } from '../taskboard/data';

// Placeholder data from the design until the timeline reads from the API.

export { TODAY } from '../taskboard/data';

/** Blocked is for work items; epics and features at risk are "warning". */
export type PlanStatus = Exclude<StatusTone, 'danger'>;

interface Planned {
  key: string;
  title: string;
  status: PlanStatus;
  /** Share done, 0–100. */
  progress: number;
  start: Date;
  /** The last day, inclusive. */
  end: Date;
}

export type Feature = Planned;

export interface Epic extends Planned {
  owner: Person | null;
  features: Feature[];
}

const mira = { name: 'Mira Okafor', initials: 'MO' };
const jonas = { name: 'Jonas Lehmann', initials: 'JL' };
const sara = { name: 'Sara Kowalski', initials: 'SK' };
const aiko = { name: 'Aiko Ramos', initials: 'AR' };
const dev = { name: 'Dev Patel', initials: 'DP' };

const plan = (
  key: string,
  title: string,
  status: PlanStatus,
  progress: number,
  start: Date,
  end: Date,
): Planned => ({ key, title, status, progress, start, end });

export const EPICS: Epic[] = [
  {
    ...plan(
      'PAY-E09',
      'EU compliance (PSD2)',
      'success',
      100,
      new Date(2026, 7, 18),
      new Date(2026, 9, 30),
    ),
    owner: jonas,
    features: [
      plan(
        'PAY-F31',
        'Strong customer authentication',
        'success',
        100,
        new Date(2026, 7, 18),
        new Date(2026, 9, 2),
      ),
      plan(
        'PAY-F32',
        '3-D Secure for EU cards',
        'success',
        100,
        new Date(2026, 8, 14),
        new Date(2026, 9, 30),
      ),
    ],
  },
  {
    ...plan('PAY-E12', 'Checkout v2', 'info', 62, new Date(2026, 9, 1), new Date(2026, 10, 28)),
    owner: mira,
    features: [
      plan('PAY-F41', 'Saved cards', 'info', 70, new Date(2026, 9, 1), new Date(2026, 10, 5)),
      plan(
        'PAY-F42',
        'Apple Pay & Google Pay',
        'review',
        85,
        new Date(2026, 9, 12),
        new Date(2026, 10, 13),
      ),
      plan(
        'PAY-F43',
        'One-page checkout',
        'neutral',
        0,
        new Date(2026, 10, 7),
        new Date(2026, 10, 28),
      ),
    ],
  },
  {
    ...plan(
      'PAY-E13',
      'Ledger reconciliation',
      'warning',
      35,
      new Date(2026, 9, 14),
      new Date(2026, 11, 19),
    ),
    owner: sara,
    features: [
      plan(
        'PAY-F51',
        'Daily settlement matching',
        'warning',
        55,
        new Date(2026, 9, 14),
        new Date(2026, 10, 20),
      ),
      plan(
        'PAY-F52',
        'Mismatch alerts',
        'neutral',
        0,
        new Date(2026, 10, 16),
        new Date(2026, 11, 19),
      ),
    ],
  },
  {
    ...plan(
      'PAY-E14',
      'Payouts automation',
      'neutral',
      0,
      new Date(2026, 10, 16),
      new Date(2027, 0, 22),
    ),
    owner: aiko,
    features: [
      plan(
        'PAY-F61',
        'Scheduled payouts',
        'neutral',
        0,
        new Date(2026, 10, 16),
        new Date(2026, 11, 18),
      ),
      plan(
        'PAY-F62',
        'Automatic payout retries',
        'neutral',
        0,
        new Date(2026, 11, 14),
        new Date(2027, 0, 22),
      ),
    ],
  },
  {
    ...plan(
      'PAY-E15',
      'Refunds & disputes',
      'neutral',
      0,
      new Date(2026, 11, 7),
      new Date(2027, 1, 26),
    ),
    owner: dev,
    features: [
      plan(
        'PAY-F71',
        'Partial refunds',
        'neutral',
        0,
        new Date(2026, 11, 7),
        new Date(2027, 0, 15),
      ),
      plan(
        'PAY-F72',
        'Dispute evidence upload',
        'neutral',
        0,
        new Date(2027, 0, 11),
        new Date(2027, 1, 26),
      ),
    ],
  },
  {
    ...plan('PAY-E16', 'Mobile wallet', 'neutral', 0, new Date(2027, 0, 18), new Date(2027, 2, 31)),
    owner: null,
    features: [
      plan('PAY-F81', 'Wallet balance', 'neutral', 0, new Date(2027, 0, 18), new Date(2027, 1, 19)),
      plan(
        'PAY-F82',
        'Top up from a card',
        'neutral',
        0,
        new Date(2027, 1, 15),
        new Date(2027, 2, 31),
      ),
    ],
  },
];

export type Level = 'epics' | 'features';
export type Scale = 'weeks' | 'months' | 'quarters' | 'years';
export type StatusFilter = PlanStatus | 'all';

/** In the order the legend lists them. */
export const PLAN_STATUSES: PlanStatus[] = ['neutral', 'info', 'review', 'warning', 'success'];

export const STATUS_OPTIONS: Option<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  ...PLAN_STATUSES.map((tone) => ({ value: tone, status: tone })),
];

export interface Range {
  value: string;
  start: Date;
  /** The last day, inclusive. */
  end: Date;
}

export const RANGES: Range[] = [
  { value: '2026-h2', start: new Date(2026, 6, 1), end: new Date(2026, 11, 31) },
  { value: 'oct-mar', start: new Date(2026, 9, 1), end: new Date(2027, 2, 31) },
  { value: '2027-h1', start: new Date(2027, 0, 1), end: new Date(2027, 5, 30) },
  { value: '2026', start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) },
  { value: '2027', start: new Date(2027, 0, 1), end: new Date(2027, 11, 31) },
];

export const DEFAULT_RANGE = 'oct-mar';

/** "1 Oct 2026 – 31 Mar 2027". */
export const rangeLabel = ({ start, end }: Range) =>
  `${format(start, 'd MMM yyyy')} – ${format(end, 'd MMM yyyy')}`;

/** "Oct 2026 – Mar 2027", for the eyebrow. */
export const rangeMonths = ({ start, end }: Range) =>
  `${format(start, 'MMM yyyy')} – ${format(end, 'MMM yyyy')}`;

export const RANGE_OPTIONS: Option[] = RANGES.map((range) => ({
  value: range.value,
  label: rangeLabel(range),
}));

export const findRange = (value: string) => RANGES.find((r) => r.value === value) ?? RANGES[0];

export const contains = (range: Range, date: Date) => date >= range.start && date <= range.end;

const length = (range: Range) => differenceInCalendarDays(range.end, range.start) + 1;

/** Where a day starts across the range, 0–1 (outside the range falls outside 0–1). */
export const offsetOf = (range: Range, date: Date) =>
  differenceInCalendarDays(date, range.start) / length(range);

export interface Column {
  label: string;
  /** Where the column starts, 0–1. */
  left: number;
}

type Dates = { start: Date; end: Date };

const units = {
  weeks: (dates: Dates) => eachWeekOfInterval(dates, { weekStartsOn: 1 }),
  months: eachMonthOfInterval,
  quarters: eachQuarterOfInterval,
  years: eachYearOfInterval,
} satisfies Record<Scale, unknown>;

/** Months name the year on the first column and on January: "OCT 2026", "NOV" … "JAN 2027". */
const labelOf = (scale: Scale, date: Date, first: boolean) => {
  if (scale === 'weeks') return format(date, 'd MMM');
  if (scale === 'quarters') return format(date, 'QQQ yyyy');
  if (scale === 'years') return format(date, 'yyyy');
  return format(date, first || date.getMonth() === 0 ? 'MMM yyyy' : 'MMM');
};

/** The scale's columns across the range; the first one is cut to start with the range. */
export const columnsOf = (range: Range, scale: Scale): Column[] =>
  units[scale](range).map((date, i) => {
    const start = max([date, range.start]);
    return { label: labelOf(scale, start, i === 0), left: offsetOf(range, start) };
  });

/** The narrowest a column draws before the track scrolls sideways, in rem. */
export const MIN_COLUMN: Record<Scale, number> = { weeks: 5.5, months: 9, quarters: 0, years: 0 };

export interface Span {
  left: number;
  width: number;
  /** It starts before the range or ends after it. */
  before: boolean;
  after: boolean;
}

/** The part of a bar inside the range, or null when none of it is. */
export const spanOf = (range: Range, { start, end }: Dates): Span | null => {
  const from = offsetOf(range, start);
  const to = offsetOf(range, addDays(end, 1));
  if (to <= 0 || from >= 1) return null;
  const left = Math.max(0, from);
  return { left, width: Math.min(1, to) - left, before: from < 0, after: to > 1 };
};

/** "18 Aug – 30 Oct". */
export const datesOf = ({ start, end }: Dates) =>
  `${format(start, 'd MMM')} – ${format(end, 'd MMM')}`;
