import { PRIORITY_LABEL } from '@lib/status';
import type { Priority } from '@ui/types';
import { clsx } from 'clsx';
import {
  Bookmark,
  Bug,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Equal,
  SquareCheck,
  UserRound,
} from 'lucide-react';
import type { ItemType, Person } from './data';

// The small pieces a work item is drawn with, shared by the table, the cards and the board.

/**
 * Makes a title link cover its whole row or card (give that one `relative`), so the row is one
 * click target and one tab stop, with the focus ring drawn around the row. Controls inside the
 * card that must stay pressable (the drag handle) sit above it with `relative z-10`.
 */
export const stretchedLink =
  'outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-focus-ring';

const types = {
  bug: { icon: Bug, label: 'Bug', className: 'bg-danger text-on-danger' },
  story: { icon: Bookmark, label: 'Story', className: 'bg-success-subtle text-success-ink' },
  task: { icon: SquareCheck, label: 'Task', className: 'bg-info-subtle text-info-ink' },
} satisfies Record<ItemType, unknown>;

export const TypeIcon = ({ type }: { type: ItemType }) => {
  const { icon: Icon, label, className } = types[type];
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`grid size-7 shrink-0 place-items-center rounded-md ${className}`}
    >
      <Icon aria-hidden strokeWidth={2} className="size-4" />
    </span>
  );
};

const priorities: Record<Priority, typeof Equal> = {
  highest: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
  low: ChevronDown,
  lowest: ChevronsDown,
};

/** The arrow, plus the name when `label` is set; compact cards show the arrow alone. */
export const PriorityIcon = ({ level, label }: { level: Priority; label?: boolean }) => {
  const Icon = priorities[level];
  const urgent = level === 'highest' || level === 'high';
  const icon = (
    <Icon
      aria-hidden
      strokeWidth={2.5}
      className={clsx('size-4.5 shrink-0', urgent ? 'text-danger' : 'text-ink')}
    />
  );
  if (!label) {
    const name = `${PRIORITY_LABEL[level]} priority`;
    return (
      <span role="img" aria-label={name} title={name} className="inline-flex">
        {icon}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-[0.9375rem] leading-5 font-bold text-ink-muted font-stretch-semi-condensed">
      {icon}
      {PRIORITY_LABEL[level]}
    </span>
  );
};

export const Avatar = ({ person, size = 'md' }: { person: Person | null; size?: 'sm' | 'md' }) => {
  const box = size === 'sm' ? 'size-8 text-[0.6875rem]' : 'size-9 text-[0.75rem]';
  if (!person) {
    return (
      <span
        role="img"
        aria-label="Unassigned"
        title="Unassigned"
        className={`grid shrink-0 place-items-center rounded-full border-[1.5px] border-dashed border-ink-muted text-ink-muted ${box}`}
      >
        <UserRound aria-hidden strokeWidth={2} className="size-4" />
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={person.name}
      title={person.name}
      className={`grid shrink-0 place-items-center rounded-full bg-ink font-display font-extrabold text-on-ink font-stretch-condensed ${box}`}
    >
      {person.initials}
    </span>
  );
};

export const Points = ({ points }: { points: number }) => (
  <span
    role="img"
    aria-label={`${points} points`}
    title={`${points} points`}
    className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-ink-muted text-meta font-bold text-ink tabular-nums"
  >
    {points}
  </span>
);

export const Tag = ({ children }: { children: string }) => (
  <span className="inline-flex h-7 items-center rounded-full bg-surface-muted px-3 text-meta whitespace-nowrap text-ink font-stretch-semi-condensed">
    {children}
  </span>
);
