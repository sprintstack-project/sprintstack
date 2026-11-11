import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import type { Option } from '@ui/types';
import {
  type ItemType,
  type WorkItem as LegacyWorkItem,
  ME,
  type Person,
  type StatusFilter,
  type TypeFilter,
} from '../taskboard/data';

// Placeholder data from the design until the backlog reads from the API.

export interface Sprint {
  id: string;
  name: string;
  state: 'active' | 'planned' | 'closed';
  start?: Date;
  end?: Date;
  capacity: number | null;
}

const PROJECT_ID = '019a0c3e-1f00-7000-8000-000000000001';
const SPRINT_24 = '019a0c3e-1f00-7000-8000-000000000024';
const SPRINT_25 = '019a0c3e-1f00-7000-8000-000000000025';

/** Sprints not yet closed, in the order they run. */
export const SPRINTS: Sprint[] = [
  {
    id: SPRINT_24,
    name: 'Sprint 24',
    state: 'active',
    start: new Date(2026, 9, 19),
    end: new Date(2026, 10, 1),
    capacity: 40,
  },
  {
    id: SPRINT_25,
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
export interface PlannedItem extends LegacyWorkItem {
  group: string;
}

type Assignee = Person & { id: string };

const mira: Assignee = { id: 'usr_mira', name: 'Mira Okafor', initials: 'MO' };
const jonas: Assignee = { id: 'usr_jonas', name: 'Jonas Lehmann', initials: 'JL' };
const sara: Assignee = { id: 'usr_sara', name: 'Sara Kowalski', initials: 'SK' };
const aiko: Assignee = { id: 'usr_aiko', name: 'Aiko Ramos', initials: 'AR' };
const dev: Assignee = { id: 'usr_dev', name: 'Dev Patel', initials: 'DP' };

const ASSIGNEES = [mira, jonas, sara, aiko, dev];

export const PEOPLE: Person[] = ASSIGNEES.map(({ name, initials }) => ({ name, initials }));

const PROJECT_KEY = 'PAY';
const CREATED_AT = '2026-10-14T09:00:00.000Z';

/** The item's key, e.g. PAY-1482. */
export const itemKey = (item: Pick<WorkItem, 'number'>) => `${PROJECT_KEY}-${item.number}`;

// Fractional-index digits, in byte order so ranks sort under the "C" collation.
const RANK_DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ranks = new Map<string | null, number>();

const item = (
  sprintId: string | null,
  number: number,
  title: string,
  type: WorkItem['type'],
  priority: WorkItem['priority'],
  points: number,
  assignee: Assignee | null = null,
  status: WorkItem['status'] = 'todo',
): WorkItem => {
  const at = ranks.get(sprintId) ?? 0;
  ranks.set(sprintId, at + 1);
  return {
    id: `019a0c3e-1f00-7000-8000-${String(number).padStart(12, '0')}`,
    projectId: PROJECT_ID,
    number,
    type,
    title,
    description: '{"type":"doc"}',
    criteria: '[]',
    status,
    atRisk: false,
    priority,
    points,
    tags: [],
    startDate: null,
    targetDate: null,
    sprintId,
    rank: `a${RANK_DIGITS[at]}`,
    parentId: null,
    assigneeId: assignee?.id ?? null,
    reporterId: mira.id,
    completedAt: null,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
};

/** Every open item, in rank order: within a sprint (or the backlog), earlier items come first. */
export const PLANNED_ITEMS: WorkItem[] = [
  item(SPRINT_24, 1482, 'Checkout fails on saved cards', 'bug', 'highest', 5, mira, 'in_progress'),
  item(SPRINT_24, 1477, 'Add Apple Pay to checkout', 'story', 'high', 8, jonas, 'in_review'),
  item(
    SPRINT_24,
    1486,
    'Show refund status in order history',
    'story',
    'medium',
    3,
    sara,
    'in_progress',
  ),
  item(SPRINT_24, 1479, 'Currency rounding off by one cent', 'bug', 'highest', 3, jonas, 'blocked'),
  item(SPRINT_25, 1490, 'Retry failed payouts automatically', 'task', 'high', 5, aiko),
  item(SPRINT_25, 1488, 'Update receipt email template', 'task', 'medium', 2, dev),
  item(null, 1497, 'Partial refunds for split payments', 'story', 'high', 8),
  item(null, 1498, 'Webhook retries send duplicate events', 'bug', 'high', 3, dev),
  item(null, 1492, 'Saved payment methods on mobile', 'story', 'low', 5),
  item(null, 1495, 'Export transactions to CSV', 'story', 'medium', 5),
  item(null, 1503, 'Dark mode for emailed receipts', 'story', 'low', 2),
  item(null, 1501, 'Tidy up onboarding copy', 'task', 'low', 1),
  item(null, 1505, 'Show fees before payout confirmation', 'story', 'medium', 3),
  item(null, 1499, 'Card expiry reminder emails', 'story', 'low', 3, sara),
  item(null, 1507, 'Payout report totals ignore refunds', 'bug', 'medium', 2),
  item(null, 1494, 'Upgrade the PDF invoice library', 'task', 'lowest', 2),
  item(null, 1509, 'Multi-currency wallets', 'story', 'low', 13),
  item(null, 1504, 'Log declined 3-D Secure attempts', 'task', 'medium', 2, aiko),
  item(null, 1506, 'Retry button on failed checkout', 'story', 'medium', 3),
  item(null, 1508, 'Remove legacy Stripe v2 client', 'task', 'lowest', 5),
];

/** An API work item as the old backlog draws it. */
export const asPlannedItem = (item: WorkItem): PlannedItem => {
  const assignee = ASSIGNEES.find((p) => p.id === item.assigneeId);
  return {
    group: item.sprintId ?? BACKLOG,
    key: itemKey(item),
    title: item.title,
    // The old backlog only draws stories, bugs and tasks.
    type: item.type as ItemType,
    status: item.status,
    priority: item.priority,
    assignee: assignee ? { name: assignee.name, initials: assignee.initials } : null,
    points: item.points ?? 0,
    tags: item.tags,
  };
};

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

export const filterItems = <T extends LegacyWorkItem>(
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

export const sumPoints = (items: LegacyWorkItem[]) => items.reduce((sum, i) => sum + i.points, 0);

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
