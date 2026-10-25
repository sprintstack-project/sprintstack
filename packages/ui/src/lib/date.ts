// Calendar-date helpers shared by the web and native DatePicker. Dates are ISO "YYYY-MM-DD" strings,
// read as local calendar days (never through UTC, which would shift them across time zones).

export const parseISODate = (iso: string | null | undefined): Date | undefined => {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

export const toISODate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const sameDay = (a?: Date, b?: Date) => Boolean(a && b && toISODate(a) === toISODate(b));

/** Fields show full dates: "30 Oct 2026". */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const monthTitle = (date: Date) =>
  date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

export const MONTHS_SHORT = Array.from({ length: 12 }, (_, m) =>
  new Date(2026, m, 1).toLocaleDateString('en-GB', { month: 'short' }),
);

export const isOutOfRange = (date: Date, min?: Date, max?: Date) =>
  Boolean((min && date < min) || (max && date > max));

/**
 * Weeks of the month as rows of 7, padded with nulls outside the month (those cells stay hidden).
 * Always 6 rows, so the calendar keeps one height whatever the month.
 */
export const monthWeeks = (month: Date, weekStartsOn: 0 | 1 | 6): (Date | null)[][] => {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const cells: (Date | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from(
      { length: days },
      (_, d) => new Date(month.getFullYear(), month.getMonth(), d + 1),
    ),
  ];
  while (cells.length < 42) cells.push(null);
  return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
};

/** Two-letter weekday headers starting on `weekStartsOn`. */
export const weekdayLabels = (weekStartsOn: 0 | 1 | 6) => {
  // 4 Jan 2026 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(2026, 0, 4 + ((weekStartsOn + i) % 7));
    return {
      short: day.toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2),
      long: day.toLocaleDateString('en-GB', { weekday: 'long' }),
    };
  });
};
