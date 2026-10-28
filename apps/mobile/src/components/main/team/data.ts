import { parseISODate, toISODate } from '@lib/date';
import { formOptions } from '@sprintstack/forms';
import {
  type DateRange,
  type NewTimeOff,
  TIME_OFF_TYPES,
  type TimeOffInput,
  type TimeOffType,
  timeOffSchema,
} from '@sprintstack/shared';
import type { CalendarMarker, Option } from '@ui/types';
import {
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isWeekend,
  isWithinInterval,
} from 'date-fns';

// Placeholder data until the team page reads from the API (same as the web team page).

export { TODAY } from '../taskboard/data';

export type View = 'capacity' | 'vacations';

export { TIME_OFF_TYPES, type TimeOffType };

export const TYPE_LABEL: Record<TimeOffType, string> = {
  vacation: 'Vacation',
  sick: 'Sick',
  half: 'Half day',
  other: 'Other',
};

export interface Member {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Takes story points. Design and QA don't, so they have days but no point capacity. */
  estimates: boolean;
}

export interface TimeOff {
  id: string;
  member: string;
  type: TimeOffType;
  start: Date;
  /** The last day, inclusive. A half day starts and ends on the same day. */
  end: Date;
}

/** Time off as the form holds it (ISO dates, null until picked); new entries have no id yet. */
export type TimeOffDraft = TimeOffInput & { id?: string };

export interface Sprint {
  id: string;
  name: string;
  start: Date;
  end: Date;
  state: 'closed' | 'active' | 'planned';
  /** Points assigned to each member. */
  assigned: Record<string, number>;
  /** Committed points nobody has picked up yet. */
  unassigned: number;
}

export const MEMBERS: Member[] = [
  { id: 'mira', name: 'Mira Okafor', initials: 'MO', role: 'Engineering lead', estimates: true },
  { id: 'jonas', name: 'Jonas Lehmann', initials: 'JL', role: 'Backend engineer', estimates: true },
  { id: 'aiko', name: 'Aiko Ramos', initials: 'AR', role: 'Backend engineer', estimates: true },
  { id: 'dev', name: 'Dev Patel', initials: 'DP', role: 'Frontend engineer', estimates: true },
  { id: 'sara', name: 'Sara Kowalski', initials: 'SK', role: 'Mobile engineer', estimates: true },
  { id: 'lena', name: 'Lena Fischer', initials: 'LF', role: 'Product designer', estimates: false },
  { id: 'tom', name: 'Tom Becker', initials: 'TB', role: 'QA engineer', estimates: false },
];

/** The signed-in person, who "Add time off" starts with. */
export const ME = 'mira';

export const MEMBER_OPTIONS: Option[] = MEMBERS.map((m) => ({
  value: m.id,
  label: m.name,
  avatar: m.initials,
  description: m.role,
}));

export const findMember = (id: string) => MEMBERS.find((m) => m.id === id) ?? MEMBERS[0];

export const firstName = (member: Member) => member.name.split(' ')[0];

export const SPRINTS: Sprint[] = [
  {
    id: 'sprint-23',
    name: 'Sprint 23',
    start: new Date(2026, 9, 5),
    end: new Date(2026, 9, 18),
    state: 'closed',
    assigned: { mira: 8, jonas: 9, aiko: 8, dev: 7, sara: 4 },
    unassigned: 0,
  },
  {
    id: 'sprint-24',
    name: 'Sprint 24',
    start: new Date(2026, 9, 19),
    end: new Date(2026, 10, 1),
    state: 'active',
    assigned: { mira: 13, jonas: 11, aiko: 5, dev: 2, sara: 4 },
    unassigned: 5,
  },
  {
    id: 'sprint-25',
    name: 'Sprint 25',
    start: new Date(2026, 10, 2),
    end: new Date(2026, 10, 15),
    state: 'planned',
    assigned: { mira: 6, jonas: 5, aiko: 8, dev: 9, sara: 5 },
    unassigned: 3,
  },
];

export const ACTIVE_SPRINT = 'sprint-24';

export const findSprint = (id: string) => SPRINTS.find((s) => s.id === id) ?? SPRINTS[1];

export const sprintDates = (sprint: Sprint) =>
  `${format(sprint.start, 'd MMM')} – ${format(sprint.end, 'd MMM')}`;

export const SPRINT_OPTIONS: Option[] = SPRINTS.map((s) => ({
  value: s.id,
  label: `${s.name} · ${sprintDates(s)}`,
  description: s.state === 'active' ? 'Active' : s.state === 'closed' ? 'Closed' : 'Planned',
}));

export const HOLIDAYS = [{ date: new Date(2026, 9, 30), name: 'Company holiday' }];

/** Holidays as the calendar flags them. */
export const HOLIDAY_MARKERS: CalendarMarker[] = HOLIDAYS.map((h) => ({
  date: toISODate(h.date),
  label: h.name,
}));

export const TIME_OFF: TimeOff[] = [
  {
    id: 't1',
    member: 'dev',
    type: 'vacation',
    start: new Date(2026, 9, 8),
    end: new Date(2026, 9, 9),
  },
  {
    id: 't2',
    member: 'mira',
    type: 'sick',
    start: new Date(2026, 9, 13),
    end: new Date(2026, 9, 13),
  },
  {
    id: 't3',
    member: 'jonas',
    type: 'vacation',
    start: new Date(2026, 9, 22),
    end: new Date(2026, 9, 23),
  },
  {
    id: 't4',
    member: 'aiko',
    type: 'vacation',
    start: new Date(2026, 9, 26),
    end: new Date(2026, 9, 29),
  },
  {
    id: 't5',
    member: 'sara',
    type: 'sick',
    start: new Date(2026, 9, 28),
    end: new Date(2026, 9, 28),
  },
  {
    id: 't6',
    member: 'lena',
    type: 'vacation',
    start: new Date(2026, 9, 19),
    end: new Date(2026, 9, 20),
  },
  {
    id: 't7',
    member: 'tom',
    type: 'half',
    start: new Date(2026, 9, 21),
    end: new Date(2026, 9, 21),
  },
  {
    id: 't8',
    member: 'sara',
    type: 'vacation',
    start: new Date(2026, 10, 3),
    end: new Date(2026, 10, 6),
  },
  {
    id: 't9',
    member: 'jonas',
    type: 'half',
    start: new Date(2026, 10, 12),
    end: new Date(2026, 10, 12),
  },
];

/** Points completed in the last closed sprints, oldest first. */
export const VELOCITY = [
  { sprint: 21, points: 34 },
  { sprint: 22, points: 38 },
  { sprint: 23, points: 36 },
];

export const holidayOn = (day: Date) => HOLIDAYS.find((h) => isSameDay(h.date, day));

export const isWorkingDay = (day: Date) => !isWeekend(day) && !holidayOn(day);

/** Every day from start to end; none when they're the wrong way round. */
export const daysBetween = (start: Date, end: Date) =>
  start > end ? [] : eachDayOfInterval({ start, end });

export const sprintDays = (sprint: Sprint) => daysBetween(sprint.start, sprint.end);

export const workingDaysBetween = (start: Date, end: Date) =>
  daysBetween(start, end).filter(isWorkingDay).length;

export const overlaps = (entry: { start: Date; end: Date }, sprint: Sprint) =>
  entry.start <= sprint.end && entry.end >= sprint.start;

/** How much of a day someone is off: 1, ½ for a half day, 0 when in. Overlapping entries count once. */
const offOn = (entries: TimeOff[], member: string, day: Date) =>
  Math.max(
    0,
    ...entries
      .filter((e) => e.member === member && isWithinInterval(day, { start: e.start, end: e.end }))
      .map((e) => (e.type === 'half' ? 0.5 : 1)),
  );

/** Working days off within the sprint. */
export const daysOff = (entries: TimeOff[], member: string, sprint: Sprint) =>
  sprintDays(sprint)
    .filter(isWorkingDay)
    .reduce((sum, day) => sum + offOn(entries, member, day), 0);

/** The member's entries that touch the sprint, earliest first. */
export const entriesIn = (entries: TimeOff[], member: string, sprint: Sprint) =>
  entries
    .filter((e) => e.member === member && overlaps(e, sprint))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

/**
 * Days people changed by hand (meetings, support rota, part-time), on top of working days minus time
 * off, per sprint and member.
 */
export type Adjustments = Record<string, number>;

export const adjustKey = (sprint: Sprint, member: string) => `${sprint.id}:${member}`;

export const availableDays = (
  member: string,
  sprint: Sprint,
  entries: TimeOff[],
  adjust: Adjustments,
) => {
  const working = workingDaysBetween(sprint.start, sprint.end);
  const days =
    working - daysOff(entries, member, sprint) + (adjust[adjustKey(sprint, member)] ?? 0);
  return Math.min(working, Math.max(0, days));
};

/** One point per available day, whole points only; null for people who don't estimate. */
export const capacityOf = (member: Member, available: number) =>
  member.estimates ? Math.floor(available) : null;

export interface MemberLoad {
  member: Member;
  off: number;
  available: number;
  capacity: number | null;
  assigned: number;
}

export const loadsOf = (sprint: Sprint, entries: TimeOff[], adjust: Adjustments): MemberLoad[] =>
  MEMBERS.map((member) => {
    const available = availableDays(member.id, sprint, entries, adjust);
    return {
      member,
      off: daysOff(entries, member.id, sprint),
      available,
      capacity: capacityOf(member, available),
      assigned: sprint.assigned[member.id] ?? 0,
    };
  });

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export const summaryOf = (sprint: Sprint, loads: MemberLoad[]) => {
  const working = workingDaysBetween(sprint.start, sprint.end);
  return {
    working,
    total: working * loads.length,
    available: sum(loads.map((l) => l.available)),
    off: sum(loads.map((l) => l.off)),
    holidays: HOLIDAYS.filter((h) => !isWeekend(h.date) && isWithinInterval(h.date, sprint)).length,
    capacity: sum(loads.map((l) => l.capacity ?? 0)),
    committed: sum(loads.map((l) => l.assigned)) + sprint.unassigned,
  };
};

const listNames = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;

/** Who is over: "Mira and Jonas are 4 pts over." */
export const overloadText = (loads: MemberLoad[]) => {
  const over = loads.filter((l) => l.capacity !== null && l.assigned > l.capacity);
  if (over.length === 0) return null;
  const names = listNames(over.map((l) => firstName(l.member)));
  const amounts = over.map((l) => l.assigned - (l.capacity ?? 0));
  if (over.length === 1) return `${names} is ${amounts[0]} pts over.`;
  return amounts.every((a) => a === amounts[0])
    ? `${names} are ${amounts[0]} pts over.`
    : `${names} are ${sum(amounts)} pts over between them.`;
};

/** Whole days plainly, halves with their decimal: 9, 8.5. */
export const formatDays = (days: number) =>
  Number.isInteger(days) ? String(days) : days.toFixed(1);

/** "1 day off", "2 days off"; nothing off reads "Available all sprint". */
export const offLabel = (off: number) =>
  off === 0 ? 'Available all sprint' : `${formatDays(off)} ${off === 1 ? 'day' : 'days'} off`;

/** An entry's dates for chips: "28 Oct", "22–23 Oct", "30 Oct – 2 Nov". */
export const spanLabel = ({ start, end }: { start: Date; end: Date }) => {
  if (isSameDay(start, end)) return format(start, 'd MMM');
  if (isSameMonth(start, end)) return `${format(start, 'd')}–${format(end, 'd MMM')}`;
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM')}`;
};

/** A picked range with weekdays: "Mon 26 – Thu 29 Oct". */
export const rangeLabel = (start: Date, end: Date) => {
  if (isSameDay(start, end)) return format(start, 'EEE d MMM');
  if (isSameMonth(start, end)) return `${format(start, 'EEE d')} – ${format(end, 'EEE d MMM')}`;
  return `${format(start, 'EEE d MMM')} – ${format(end, 'EEE d MMM')}`;
};

/** A picked range as dates; null until it's picked. */
export const datesOf = (range: DateRange | null) => {
  const start = parseISODate(range?.start);
  const end = parseISODate(range?.end);
  return start && end ? { start, end } : null;
};

/** A blank draft for the member, or one covering the days given. */
export const newDraft = (member: string, start?: Date, end = start): TimeOffDraft => ({
  member,
  type: 'vacation',
  dates: start && end ? { start: toISODate(start), end: toISODate(end) } : null,
});

/** An entry opened for editing. */
export const draftOf = ({ id, member, type, start, end }: TimeOff): TimeOffDraft => ({
  id,
  member,
  type,
  dates: { start: toISODate(start), end: toISODate(end) },
});

/** A saved form as an entry. The schema has checked the dates, so they parse. */
export const timeOffOf = (id: string, { member, type, dates }: NewTimeOff): TimeOff => ({
  id,
  member,
  type,
  start: new Date(`${dates.start}T00:00`),
  end: new Date(`${dates.end}T00:00`),
});

export const timeOffForm = formOptions({
  defaultValues: newDraft(ME) as TimeOffInput,
  // Validate on every change; fields show errors once left or after a submit attempt.
  validators: { onChange: timeOffSchema },
});

/** The calendar's own check: time off has to take at least one working day. */
export const workingDaysError = (range: DateRange | null) => {
  const dates = datesOf(range);
  return dates && workingDaysBetween(dates.start, dates.end) === 0
    ? 'Pick at least one working day'
    : undefined;
};

/** Working days the draft takes off, ½ for a half day. */
export const draftDays = (draft: TimeOffInput) => {
  const dates = datesOf(draft.dates);
  if (!dates) return 0;
  const days = workingDaysBetween(dates.start, dates.end);
  return draft.type === 'half' ? days / 2 : days;
};

/**
 * What saving the draft does to the sprint it starts in: the member's days before and after, and
 * whether their assigned points still fit.
 */
export const impactOf = (draft: TimeOffDraft, entries: TimeOff[], adjust: Adjustments) => {
  const dates = datesOf(draft.dates);
  if (!dates) return null;
  const { start, end } = dates;
  const sprint = SPRINTS.find((s) => overlaps({ start, end }, s));
  if (!sprint) return null;
  const member = findMember(draft.member);
  const others = entries.filter((e) => e.id !== draft.id);
  const entry: TimeOff = {
    id: draft.id ?? 'draft',
    member: member.id,
    type: draft.type,
    start,
    end,
  };
  const before = availableDays(member.id, sprint, others, adjust);
  const after = availableDays(member.id, sprint, [...others, entry], adjust);
  const assigned = sprint.assigned[member.id] ?? 0;
  const capacity = capacityOf(member, after);
  return {
    fits: capacity === null || assigned <= capacity,
    headline: `${sprint.name}: ${firstName(member)} goes from ${formatDays(before)} to ${formatDays(after)} days.`,
    detail:
      capacity === null
        ? null
        : assigned <= capacity
          ? `${firstName(member)}’s ${assigned} assigned points still fit.`
          : `${firstName(member)}’s ${assigned} assigned points no longer fit, ${assigned - capacity} over.`,
  };
};
