import type { Priority, StatusTone } from '@ui/types';
import { addDays, differenceInCalendarDays, eachDayOfInterval, format } from 'date-fns';

// Placeholder data from the design until the dashboard reads from the API.

// Fixed so the sprint maths match the design (and because cacheComponents won't prerender
// `new Date()`).
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

export const ASSIGNED = { total: 7, dueToday: 1, dueThisWeek: 2 };

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

export const NEXT_ITEMS: WorkItem[] = [
  {
    key: 'PAY-1482',
    title: 'Checkout fails on saved cards',
    type: 'bug',
    priority: 'highest',
    status: 'info',
    due: TODAY,
  },
  {
    key: 'PAY-1479',
    title: 'Currency rounding off by one cent',
    type: 'bug',
    priority: 'highest',
    status: 'danger',
    due: addDays(TODAY, 1),
  },
  {
    key: 'PAY-1471',
    title: '3-D Secure for EU cards',
    type: 'story',
    priority: 'high',
    status: 'success',
    due: new Date(2026, 9, 28),
  },
  {
    key: 'PAY-1490',
    title: 'Retry failed payouts automatically',
    type: 'task',
    priority: 'high',
    status: 'neutral',
    due: new Date(2026, 9, 30),
  },
  {
    key: 'PAY-1488',
    title: 'Update receipt email template',
    type: 'task',
    priority: 'medium',
    status: 'neutral',
    due: new Date(2026, 10, 1),
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
  quote?: string;
  time: string;
}

export const ACTIVITY: { title: string; items: Activity[] }[] = [
  {
    title: 'Today',
    items: [
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
        quote: 'Repro’d on Safari 18 only.',
        time: '22 min ago',
      },
      {
        id: '3',
        actor: 'Sara Kowalski',
        avatar: 'SK',
        action: 'logged 3h on',
        issueKey: 'PAY-1486',
        time: '1 h ago',
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
    ],
  },
  {
    title: 'Yesterday',
    items: [
      {
        id: '5',
        actor: 'Dev Patel',
        avatar: 'DP',
        action: 'created',
        issueKey: 'PAY-1498',
        target: { prefix: 'in', label: 'Backlog' },
        time: 'Sun 17:40',
      },
    ],
  },
];

// Remaining story points at the end of each day so far.
const REMAINING = [40, 39, 36, 33, 30, 27, 23, 19];

const sprintDays = eachDayOfInterval({ start: SPRINT.start, end: SPRINT.end });

export const BURNDOWN = sprintDays.map((day, i) => ({
  label: format(day, 'd MMM'),
  remaining: REMAINING[i] ?? null,
  ideal: SPRINT.pointsTotal - (SPRINT.pointsTotal * i) / (sprintDays.length - 1),
}));

// Every third day, plus the last (dropping a third-day tick that would crowd it).
const last = BURNDOWN.length - 1;
export const BURNDOWN_TICKS = BURNDOWN.filter(
  (_, i) => (i % 3 === 0 && last - i > 1) || i === last,
).map((point) => point.label);

export const STATUS_COUNTS: { tone: StatusTone; count: number }[] = [
  { tone: 'neutral', count: 12 },
  { tone: 'info', count: 9 },
  { tone: 'review', count: 5 },
  { tone: 'danger', count: 2 },
  { tone: 'success', count: 6 },
];

export interface SetupStep {
  label: string;
  href: string;
  done: boolean;
}

/** The first-run checklist an empty dashboard leads with. */
export const SETUP_STEPS: SetupStep[] = [
  { label: 'Create the Payments project', href: '/project-settings', done: true },
  { label: 'Invite your team', href: '/team', done: false },
  { label: 'Create your first work item', href: '/backlog', done: false },
  { label: 'Plan and start a sprint', href: '/backlog', done: false },
];
