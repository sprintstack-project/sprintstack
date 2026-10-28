import type { Option, StatusTone } from '@ui/types';
import {
  type ItemType,
  ME,
  type Person,
  type StatusFilter,
  type TypeFilter,
  type WorkItem,
} from '../taskboard/data';

// Placeholder data from the design until the backlog reads from the API.

export interface Sprint {
  id: string;
  name: string;
  state: 'active' | 'planned';
  start: Date;
  end: Date;
  /** Points the team expects to finish in the sprint. */
  capacity: number;
}

/** Sprints not yet closed, in the order they run. */
export const SPRINTS: Sprint[] = [
  {
    id: 'sprint-24',
    name: 'Sprint 24',
    state: 'active',
    start: new Date(2026, 9, 19),
    end: new Date(2026, 10, 1),
    capacity: 40,
  },
  {
    id: 'sprint-25',
    name: 'Sprint 25',
    state: 'planned',
    start: new Date(2026, 10, 2),
    end: new Date(2026, 10, 15),
    capacity: 40,
  },
];

/** The group of items no sprint has taken yet. */
export const BACKLOG = 'backlog';

/** Where an item is planned: a sprint id, or BACKLOG. */
export interface PlannedItem extends WorkItem {
  group: string;
}

const mira = { name: 'Mira Okafor', initials: 'MO' };
const jonas = { name: 'Jonas Lehmann', initials: 'JL' };
const sara = { name: 'Sara Kowalski', initials: 'SK' };
const aiko = { name: 'Aiko Ramos', initials: 'AR' };
const dev = { name: 'Dev Patel', initials: 'DP' };

export const PEOPLE: Person[] = [mira, jonas, sara, aiko, dev];

const item = (
  group: string,
  key: string,
  title: string,
  type: ItemType,
  priority: WorkItem['priority'],
  points: number,
  assignee: Person | null = null,
  status: StatusTone = 'neutral',
): PlannedItem => ({ group, key, title, type, status, priority, assignee, points, tags: [] });

/** Every open item, in rank order: within a group, earlier items come first. */
export const PLANNED_ITEMS: PlannedItem[] = [
  item('sprint-24', 'PAY-1482', 'Checkout fails on saved cards', 'bug', 'highest', 5, mira, 'info'),
  item('sprint-24', 'PAY-1477', 'Add Apple Pay to checkout', 'story', 'high', 8, jonas, 'review'),
  item(
    'sprint-24',
    'PAY-1486',
    'Show refund status in order history',
    'story',
    'medium',
    3,
    sara,
    'info',
  ),
  item(
    'sprint-24',
    'PAY-1479',
    'Currency rounding off by one cent',
    'bug',
    'highest',
    3,
    jonas,
    'danger',
  ),
  item('sprint-25', 'PAY-1490', 'Retry failed payouts automatically', 'task', 'high', 5, aiko),
  item('sprint-25', 'PAY-1488', 'Update receipt email template', 'task', 'medium', 2, dev),
  item(BACKLOG, 'PAY-1497', 'Partial refunds for split payments', 'story', 'high', 8),
  item(BACKLOG, 'PAY-1498', 'Webhook retries send duplicate events', 'bug', 'high', 3, dev),
  item(BACKLOG, 'PAY-1492', 'Saved payment methods on mobile', 'story', 'low', 5),
  item(BACKLOG, 'PAY-1495', 'Export transactions to CSV', 'story', 'medium', 5),
  item(BACKLOG, 'PAY-1503', 'Dark mode for emailed receipts', 'story', 'low', 2),
  item(BACKLOG, 'PAY-1501', 'Tidy up onboarding copy', 'task', 'low', 1),
  item(BACKLOG, 'PAY-1505', 'Show fees before payout confirmation', 'story', 'medium', 3),
  item(BACKLOG, 'PAY-1499', 'Card expiry reminder emails', 'story', 'low', 3, sara),
  item(BACKLOG, 'PAY-1507', 'Payout report totals ignore refunds', 'bug', 'medium', 2),
  item(BACKLOG, 'PAY-1494', 'Upgrade the PDF invoice library', 'task', 'lowest', 2),
  item(BACKLOG, 'PAY-1509', 'Multi-currency wallets', 'story', 'low', 13),
  item(BACKLOG, 'PAY-1504', 'Log declined 3-D Secure attempts', 'task', 'medium', 2, aiko),
  item(BACKLOG, 'PAY-1506', 'Retry button on failed checkout', 'story', 'medium', 3),
  item(BACKLOG, 'PAY-1508', 'Remove legacy Stripe v2 client', 'task', 'lowest', 5),
];

/** Backlog rows shown before "Show more". */
export const BACKLOG_PAGE = 6;

export interface Filters {
  query: string;
  type: TypeFilter;
  status: StatusFilter;
  /** A person's name, or "anyone" / "unassigned". */
  assignee: string;
}

export const NO_FILTERS: Filters = { query: '', type: 'all', status: 'all', assignee: 'anyone' };

export const ASSIGNEE_OPTIONS: Option[] = [
  { value: 'anyone', label: 'Anyone' },
  { value: ME, label: 'Me', avatar: 'MO' },
  ...PEOPLE.filter((p) => p.name !== ME).map((p) => ({
    value: p.name,
    label: p.name,
    avatar: p.initials,
  })),
  { value: 'unassigned', label: 'Unassigned' },
];

export const filterItems = <T extends WorkItem>(
  items: T[],
  { query, type, status, assignee }: Filters,
) => {
  const q = query.trim().toLowerCase();
  return items.filter(
    (item) =>
      (!q || item.title.toLowerCase().includes(q) || item.key.toLowerCase().includes(q)) &&
      (type === 'all' || item.type === type) &&
      (status === 'all' || item.status === status) &&
      (assignee === 'anyone' ||
        (assignee === 'unassigned' ? !item.assignee : item.assignee?.name === assignee)),
  );
};

export const sumPoints = (items: WorkItem[]) => items.reduce((sum, i) => sum + i.points, 0);

/**
 * Moves `key` into `group`, just before `beforeKey` (or to the end of the list). Each group shows
 * its items in list order, so this is also its rank in the group.
 */
export const moveTo =
  (key: string, group: string, beforeKey: string | null) => (all: PlannedItem[]) => {
    const moving = all.find((i) => i.key === key);
    if (!moving) return all;
    const rest = all.filter((i) => i.key !== key);
    const at = beforeKey ? rest.findIndex((i) => i.key === beforeKey) : -1;
    rest.splice(at === -1 ? rest.length : at, 0, { ...moving, group });
    return rest;
  };
