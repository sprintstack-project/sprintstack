import type { Option, Priority, StatusTone } from '@ui/types';
import { differenceInCalendarDays } from 'date-fns';

// Placeholder data from the design until the taskboard reads from the API.

// Fixed so the sprint maths match the design (and because cacheComponents won't prerender
// `new Date()`).
export const TODAY = new Date(2026, 9, 26);

export const SPRINT = {
  name: 'Sprint 24',
  start: new Date(2026, 9, 19),
  end: new Date(2026, 10, 1),
};

export const SPRINT_DAYS_LEFT = differenceInCalendarDays(SPRINT.end, TODAY);

export const SPRINTS: Option[] = [
  { value: 'sprint-24', label: 'Sprint 24', description: 'Active' },
  { value: 'sprint-23', label: 'Sprint 23', description: 'Closed' },
  { value: 'sprint-25', label: 'Sprint 25', description: 'Planned' },
];

/** The signed-in person, for "Assigned to me". */
export const ME = 'Mira Okafor';

export type ItemType = 'bug' | 'story' | 'task';

export interface Person {
  name: string;
  initials: string;
}

export interface WorkItem {
  key: string;
  title: string;
  type: ItemType;
  status: StatusTone;
  priority: Priority;
  assignee: Person | null;
  points: number;
  tags: string[];
  /** Share of subtasks done, 0–100, for work under way. */
  progress?: number;
}

const mira = { name: 'Mira Okafor', initials: 'MO' };
const jonas = { name: 'Jonas Lehmann', initials: 'JL' };
const sara = { name: 'Sara Kowalski', initials: 'SK' };
const aiko = { name: 'Aiko Ramos', initials: 'AR' };
const dev = { name: 'Dev Patel', initials: 'DP' };

export const WORK_ITEMS: WorkItem[] = [
  {
    key: 'PAY-1482',
    title: 'Checkout fails on saved cards',
    type: 'bug',
    status: 'info',
    priority: 'highest',
    assignee: mira,
    points: 5,
    tags: ['checkout', 'web'],
    progress: 60,
  },
  {
    key: 'PAY-1477',
    title: 'Add Apple Pay to checkout',
    type: 'story',
    status: 'review',
    priority: 'high',
    assignee: jonas,
    points: 8,
    tags: ['checkout', 'ios'],
    progress: 90,
  },
  {
    key: 'PAY-1486',
    title: 'Show refund status in order history',
    type: 'story',
    status: 'info',
    priority: 'medium',
    assignee: sara,
    points: 3,
    tags: ['orders'],
    progress: 25,
  },
  {
    key: 'PAY-1479',
    title: 'Currency rounding off by one cent',
    type: 'bug',
    status: 'danger',
    priority: 'highest',
    assignee: jonas,
    points: 3,
    tags: ['ledger'],
  },
  {
    key: 'PAY-1490',
    title: 'Retry failed payouts automatically',
    type: 'task',
    status: 'neutral',
    priority: 'high',
    assignee: aiko,
    points: 5,
    tags: ['payouts'],
  },
  {
    key: 'PAY-1488',
    title: 'Update receipt email template',
    type: 'task',
    status: 'neutral',
    priority: 'medium',
    assignee: dev,
    points: 2,
    tags: ['email'],
  },
  {
    key: 'PAY-1492',
    title: 'Saved payment methods on mobile',
    type: 'story',
    status: 'neutral',
    priority: 'low',
    assignee: null,
    points: 5,
    tags: ['mobile'],
  },
  {
    key: 'PAY-1471',
    title: '3-D Secure for EU cards',
    type: 'story',
    status: 'success',
    priority: 'high',
    assignee: mira,
    points: 8,
    tags: ['compliance'],
  },
  {
    key: 'PAY-1468',
    title: 'Rotate webhook signing secret',
    type: 'task',
    status: 'success',
    priority: 'medium',
    assignee: sara,
    points: 1,
    tags: ['security'],
  },
];

/** The work item's own page. */
export const itemHref = (key: string) => `/taskboard/${key}`;

/** Every status an item can have, in workflow order. */
export const STATUSES: StatusTone[] = ['neutral', 'info', 'review', 'danger', 'success'];

/** Kanban columns. Blocked work has no column of its own: it stays in progress, badged. */
export const COLUMNS: StatusTone[] = ['neutral', 'info', 'review', 'success'];

export const columnOf = (status: StatusTone): StatusTone => (status === 'danger' ? 'info' : status);

export type View = 'list' | 'kanban';
export type TypeFilter = ItemType | 'all';
export type StatusFilter = StatusTone | 'all';

export interface Filters {
  query: string;
  type: TypeFilter;
  status: StatusFilter;
  mine: boolean;
}

export const NO_FILTERS: Filters = { query: '', type: 'all', status: 'all', mine: false };

export const TYPE_OPTIONS: Option<TypeFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'bug', label: 'Bug' },
  { value: 'story', label: 'Story' },
  { value: 'task', label: 'Task' },
];

export const STATUS_OPTIONS: Option<StatusFilter>[] = [
  { value: 'all', label: 'All' },
  ...STATUSES.map((tone) => ({ value: tone, status: tone })),
];

export const filterItems = (items: WorkItem[], { query, type, status, mine }: Filters) => {
  const q = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (!q || item.title.toLowerCase().includes(q) || item.key.toLowerCase().includes(q)) &&
      (type === 'all' || item.type === type) &&
      (status === 'all' || item.status === status) &&
      (!mine || item.assignee?.name === ME),
  );
};
