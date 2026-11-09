import type { Priority, StatusTone } from '@ui/types';
import { addDays, differenceInCalendarDays, eachDayOfInterval, format } from 'date-fns';

// Placeholder data until the dashboard reads from the API (same as the web dashboard).

// Fixed so the sprint maths match the design.
export const TODAY = new Date(2026, 9, 26);

export const USER = { firstName: 'Mira' };

export const SPRINT = {
  name: 'Sprint 24',
  start: new Date(2026, 9, 19),
  end: new Date(2026, 10, 1),
  pointsDone: 21,
  pointsTotal: 40,
};

export const SPRINT_DAYS_LEFT = differenceInCalendarDays(SPRINT.end, TODAY);

export const ASSIGNED = { total: 7, dueToday: 1 };

export type Assigned = typeof ASSIGNED;

export const AWAITING_REVIEW = 3;

export type ItemType = 'bug' | 'story' | 'task';

export interface WorkItem {
  key: string;
  title: string;
  type: ItemType;
  priority: Priority;
  status: StatusTone;
  due: Date;
}

export const dueLabel = (due: Date) => {
  const days = differenceInCalendarDays(due, TODAY);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return format(due, 'd MMM');
};

export const NEXT_ITEMS: WorkItem[] = [
  {
    key: 'PAY-1482',
    title: 'Checkout fails on saved cards',
    type: 'bug',
    priority: 'highest',
    status: 'in_progress',
    due: TODAY,
  },
  {
    key: 'PAY-1479',
    title: 'Currency rounding off by one cent',
    type: 'bug',
    priority: 'highest',
    status: 'blocked',
    due: addDays(TODAY, 1),
  },
  {
    key: 'PAY-1471',
    title: '3-D Secure for EU cards',
    type: 'story',
    priority: 'high',
    status: 'done',
    due: new Date(2026, 9, 28),
  },
  {
    key: 'PAY-1490',
    title: 'Retry failed payouts automatically',
    type: 'task',
    priority: 'high',
    status: 'todo',
    due: new Date(2026, 9, 30),
  },
];

export interface Activity {
  id: string;
  actor: string;
  avatar: string;
  action: string;
  issueKey: string;
  /** Bold text after the key, e.g. "to In review". */
  target?: { prefix: string; label: string };
  time: string;
}

export const ACTIVITY: Activity[] = [
  {
    id: '1',
    actor: 'Jonas Lehmann',
    avatar: 'JL',
    action: 'moved',
    issueKey: 'PAY-1477',
    target: { prefix: 'to', label: 'In review' },
    time: '4 min ago',
  },
  {
    id: '2',
    actor: 'Mira Okafor',
    avatar: 'MO',
    action: 'commented on',
    issueKey: 'PAY-1482',
    time: '22 min ago',
  },
  {
    id: '4',
    actor: 'Jonas Lehmann',
    avatar: 'JL',
    action: 'flagged',
    issueKey: 'PAY-1479',
    target: { prefix: 'as', label: 'Blocked' },
    time: '2 h ago',
  },
];

// Remaining story points at the end of each day so far.
export const REMAINING = [40, 39, 36, 33, 30, 27, 23, 19];

export const SPRINT_DAYS = eachDayOfInterval({ start: SPRINT.start, end: SPRINT.end });

export const IDEAL = SPRINT_DAYS.map(
  (_, i) => SPRINT.pointsTotal - (SPRINT.pointsTotal * i) / (SPRINT_DAYS.length - 1),
);

/** The burndown widget's data: the sprint, its days, and the points left on each. */
export interface Burndown {
  sprint: typeof SPRINT;
  days: Date[];
  remaining: number[];
  ideal: number[];
}

export const BURNDOWN: Burndown = {
  sprint: SPRINT,
  days: SPRINT_DAYS,
  remaining: REMAINING,
  ideal: IDEAL,
};

export interface StatusCount {
  tone: StatusTone;
  count: number;
}

/** The work-status widget's data: the sprint it covers and its items per status. */
export interface StatusSummary {
  sprintName: string;
  counts: StatusCount[];
}

export const STATUS_COUNTS: StatusCount[] = [
  { tone: 'todo', count: 12 },
  { tone: 'in_progress', count: 9 },
  { tone: 'in_review', count: 5 },
  { tone: 'blocked', count: 2 },
  { tone: 'done', count: 6 },
];

export interface SetupStep {
  label: string;
  /** Null for the step that happens in a dialog on the dashboard. */
  href: string | null;
  done: boolean;
}

/** The first-run checklist an empty dashboard leads with. */
export const SETUP_STEPS: SetupStep[] = [
  // Only shown to someone with no project, so this step is never done.
  { label: 'Create your first project', href: null, done: false },
  { label: 'Invite your team', href: '/main/team', done: false },
  { label: 'Create your first work item', href: '/main/backlog', done: false },
  { label: 'Plan and start a sprint', href: '/main/backlog', done: false },
];
