import { formOptions } from '@sprintstack/forms';
import {
  type NotificationEvent,
  type NotificationSettingsInput,
  notificationSettingsSchema,
  PROJECT_ROLE_LABEL,
  PROJECT_ROLES,
  type ProjectDetailsInput,
  projectDetailsSchema,
  type SprintSettingsInput,
  sprintSettingsSchema,
  WEEKDAYS,
  type Weekday,
} from '@sprintstack/shared';
import type { Option } from '@ui/types';
import { addDays, eachDayOfInterval, format, getISODay, isSameMonth, isWeekend } from 'date-fns';
import { useSyncExternalStore } from 'react';

// Placeholder data from the design until project settings come from the API.

export const PROJECT: ProjectDetailsInput = {
  name: 'Payments',
  key: 'PAY',
  description:
    'Checkout, payouts and the ledger. Anything that touches money goes here; customer-facing copy changes go to Growth.',
};

export const SPRINT_SETTINGS: SprintSettingsInput = {
  length: 14,
  startDay: 'mon',
  autoStart: true,
  carryOver: false,
};

export const NOTIFICATIONS: NotificationSettingsInput = {
  channel: 'email',
  rules: {
    created: { enabled: true, roles: ['product-owner', 'scrum-master'] },
    updated: { enabled: false, roles: ['developer'] },
    assigned: { enabled: true, roles: [] },
    mentioned: { enabled: true, roles: [] },
    sprint: { enabled: true, roles: ['admin', 'developer', 'product-owner'] },
  },
};

interface Saved {
  details: ProjectDetailsInput;
  sprints: SprintSettingsInput;
  notifications: NotificationSettingsInput;
}

// What was last saved, held in memory until the API exists (a reload goes back to the design's).
let saved: Saved = {
  details: PROJECT,
  sprints: SPRINT_SETTINGS,
  notifications: NOTIFICATIONS,
};
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The saved settings, which Discard goes back to; every section reads the same copy. */
export const useSaved = () =>
  useSyncExternalStore(
    subscribe,
    () => saved,
    () => saved,
  );

export const save = (patch: Partial<Saved>) => {
  saved = { ...saved, ...patch };
  for (const listener of listeners) listener();
};

/** The running sprint, which keeps its dates whatever the settings say. */
export const CURRENT_SPRINT = { number: 24, end: new Date(2026, 10, 1) };

// Validate on every change; fields show errors once left or after a submit attempt.
export const detailsForm = formOptions({
  defaultValues: PROJECT,
  validators: { onChange: projectDetailsSchema },
});

export const sprintsForm = formOptions({
  defaultValues: SPRINT_SETTINGS,
  validators: { onChange: sprintSettingsSchema },
});

export const notificationsForm = formOptions({
  defaultValues: NOTIFICATIONS,
  validators: { onChange: notificationSettingsSchema },
});

/** The picker's letter and the day's name, read out and shown under the picker. */
export const WEEKDAY_LABEL: Record<Weekday, { letter: string; name: string }> = {
  mon: { letter: 'M', name: 'Monday' },
  tue: { letter: 'T', name: 'Tuesday' },
  wed: { letter: 'W', name: 'Wednesday' },
  thu: { letter: 'T', name: 'Thursday' },
  fri: { letter: 'F', name: 'Friday' },
  sat: { letter: 'S', name: 'Saturday' },
  sun: { letter: 'S', name: 'Sunday' },
};

export const CHANNEL_CHOICES = [
  { value: 'email' as const, label: 'In-app & email' },
  { value: 'in-app' as const, label: 'In-app only' },
];

export const ROLE_OPTIONS: Option[] = PROJECT_ROLES.map((value) => ({
  value,
  label: PROJECT_ROLE_LABEL[value],
}));

export const EVENTS: { key: NotificationEvent; title: string; description: string }[] = [
  {
    key: 'created',
    title: 'A work item is created',
    description: 'New items in Payments.',
  },
  {
    key: 'updated',
    title: 'A work item is updated',
    description: 'Status, assignee, priority or due date.',
  },
  {
    key: 'assigned',
    title: 'A work item is assigned to you',
    description: 'Always on for the assignee.',
  },
  {
    key: 'mentioned',
    title: 'You’re mentioned in a comment',
    description: 'Sent straight away.',
  },
  {
    key: 'sprint',
    title: 'A sprint starts or ends',
    description: 'With a summary of what shipped.',
  },
];

/** "2–15 Nov", or "30 Nov – 13 Dec" across months. */
const rangeLabel = (start: Date, end: Date) =>
  isSameMonth(start, end)
    ? `${format(start, 'd')}–${format(end, 'd MMM')}`
    : `${format(start, 'd MMM')} – ${format(end, 'd MMM')}`;

/** The sprint after the running one, cut with these settings. */
export const nextSprint = ({
  length,
  startDay,
}: Pick<SprintSettingsInput, 'length' | 'startDay'>) => {
  const after = addDays(CURRENT_SPRINT.end, 1);
  // ISO weekdays run 1 (Monday) to 7 (Sunday), the same order as WEEKDAYS.
  const start = addDays(after, (WEEKDAYS.indexOf(startDay) + 1 - getISODay(after) + 7) % 7);
  const days = Math.max(1, Math.round(length || 1));
  const end = addDays(start, days - 1);
  return {
    name: `Sprint ${CURRENT_SPRINT.number + 1}`,
    dates: rangeLabel(start, end),
    working: eachDayOfInterval({ start, end }).filter((day) => !isWeekend(day)).length,
  };
};

/** "14 days · start on Monday". */
export const sprintsSummary = ({ length, startDay }: SprintSettingsInput) =>
  `${length} ${length === 1 ? 'day' : 'days'} · start on ${WEEKDAY_LABEL[startDay].name}`;

/** "4 of 5 rules on". */
export const notificationsSummary = ({ rules }: NotificationSettingsInput) => {
  const all = Object.values(rules);
  return `${all.filter((rule) => rule.enabled).length} of ${all.length} rules on`;
};
