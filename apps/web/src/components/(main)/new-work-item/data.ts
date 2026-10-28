import { PRIORITY_LABEL } from '@lib/status';
import { formOptions } from '@sprintstack/forms';
import {
  ISSUE_PRIORITIES,
  type NewWorkItem,
  WORK_ITEM_STATUSES,
  type WorkItemInput,
  type WorkItemLinkKind,
  type WorkItemStatus,
  workItemSchema,
} from '@sprintstack/shared';
import { EMPTY_DOC } from '@sprintstack/ui';
import type { Option, StatusTone } from '@ui/types';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Bug,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Equal,
  Link2,
  SquareCheck,
  UserRound,
} from 'lucide-react';
import { BACKLOG, PEOPLE, PLANNED_ITEMS, type PlannedItem, SPRINTS } from '../backlog/data';
import { EPICS } from '../timeline/data';

// Placeholder data until work items are created through the API.

export const TYPE_OPTIONS: Option<'bug' | 'story' | 'task'>[] = [
  { value: 'story', label: 'Story', icon: Bookmark },
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'task', label: 'Task', icon: SquareCheck },
];

export const STATUS_TONE: Record<WorkItemStatus, StatusTone> = {
  todo: 'neutral',
  in_progress: 'info',
  in_review: 'review',
  blocked: 'danger',
  done: 'success',
};

export const STATUS_OPTIONS: Option<WorkItemStatus>[] = WORK_ITEM_STATUSES.map((status) => ({
  value: status,
  status: STATUS_TONE[status],
}));

/** Stands in for "no value" in selects that can be emptied (no sprint, nobody assigned). */
export const NONE = 'none';

export const SPRINT_OPTIONS: Option[] = [
  ...SPRINTS.map((s) => ({
    value: s.id,
    label: s.name,
    description: s.state === 'active' ? 'Active' : 'Planned',
  })),
  { value: NONE, label: 'Backlog', description: 'No sprint' },
];

const priorityIcons = {
  highest: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
  low: ChevronDown,
  lowest: ChevronsDown,
};

export const PRIORITY_OPTIONS: Option<(typeof ISSUE_PRIORITIES)[number]>[] = ISSUE_PRIORITIES.map(
  (level) => ({ value: level, label: PRIORITY_LABEL[level], icon: priorityIcons[level] }),
);

export const ASSIGNEE_OPTIONS: Option[] = [
  { value: NONE, label: 'Unassigned', icon: UserRound },
  ...PEOPLE.map((p) => ({ value: p.name, label: p.name, avatar: p.initials })),
];

export const TAG_OPTIONS: Option[] = [
  'checkout',
  'compliance',
  'email',
  'invoices',
  'ios',
  'ledger',
  'mobile',
  'orders',
  'payouts',
  'security',
  'self-serve',
  'web',
].map((tag) => ({ value: tag, label: tag }));

/** Anything a new item can link to: epics, and every open work item. */
export interface Linkable {
  key: string;
  title: string;
  type: PlannedItem['type'] | 'epic';
}

export const LINKABLE: Linkable[] = [
  ...EPICS.map((e) => ({ key: e.key, title: e.title, type: 'epic' as const })),
  ...PLANNED_ITEMS.map((i) => ({ key: i.key, title: i.title, type: i.type })),
];

export const findLinkable = (key: string) => LINKABLE.find((l) => l.key === key);

/** Each kind of link, in the order the menu and the groups list them. */
export const LINK_KINDS: Record<
  WorkItemLinkKind,
  { label: string; heading: string; description: string; icon: typeof Link2 }
> = {
  parent: {
    label: 'Parent',
    heading: 'Parent',
    description: 'This item is part of it',
    icon: ChevronUp,
  },
  child: {
    label: 'Child',
    heading: 'Children',
    description: 'Breaks this item down',
    icon: ChevronDown,
  },
  related: {
    label: 'Related',
    heading: 'Related',
    description: 'Loosely connected',
    icon: Link2,
  },
  preceded_by: {
    label: 'Preceded by',
    heading: 'Preceded by',
    description: 'Has to finish before this starts',
    icon: ArrowLeft,
  },
  succeeded_by: {
    label: 'Succeeded by',
    heading: 'Succeeded by',
    description: 'Starts after this finishes',
    icon: ArrowRight,
  },
  caused_by: {
    label: 'Caused by',
    heading: 'Caused by',
    description: 'The bug or incident behind this',
    icon: Bug,
  },
};

/** Images, PDFs and CSVs, up to 25 MB each. */
export const ACCEPTED_FILES = 'image/*,application/pdf,text/csv,.csv';
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

export const emptyWorkItem = (sprint: string | null = SPRINTS[0].id): WorkItemInput => ({
  title: '',
  type: null,
  status: 'todo',
  sprint,
  priority: 'medium',
  assignee: null,
  start: null,
  target: null,
  points: null,
  tags: [],
  description: EMPTY_DOC,
  criteria: [],
  links: [],
  attachments: [],
});

/** Shared by the dialog's form and the parts built with `withForm`. */
export const workItemForm = formOptions({
  defaultValues: emptyWorkItem(),
  // Validate on every change; fields show errors once left or after a submit attempt.
  validators: { onChange: workItemSchema },
});

/** The next free key, e.g. "PAY-1493". */
const nextKey = (existing: string[]) => {
  const numbers = existing.map((key) => Number(key.split('-')[1])).filter(Number.isFinite);
  return `PAY-${Math.max(0, ...numbers) + 1}`;
};

/** A created item as the taskboard and backlog draw it, until they read from the API. */
export const toPlannedItem = (item: NewWorkItem, existing: string[]): PlannedItem => ({
  key: nextKey(existing),
  group: item.sprint ?? BACKLOG,
  title: item.title,
  type: item.type,
  status: STATUS_TONE[item.status],
  priority: item.priority,
  assignee: PEOPLE.find((p) => p.name === item.assignee) ?? null,
  points: item.points ?? 0,
  tags: item.tags,
});
