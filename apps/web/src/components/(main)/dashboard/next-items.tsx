import { PRIORITY_LABEL } from '@lib/status';
import { Badge } from '@ui/badge';
import type { Priority } from '@ui/types';
import { differenceInCalendarDays, format } from 'date-fns';
import { Bookmark, Bug, ChevronsUp, ChevronUp, Equal, SquareCheck } from 'lucide-react';
import { type ItemType, NEXT_ITEMS, TODAY } from './data';

const types = {
  bug: { icon: Bug, label: 'Bug', className: 'bg-danger text-on-danger' },
  story: { icon: Bookmark, label: 'Story', className: 'bg-success-subtle text-success-ink' },
  task: { icon: SquareCheck, label: 'Task', className: 'bg-info-subtle text-info-ink' },
} satisfies Record<ItemType, unknown>;

// Compact rows show the arrow alone; the label stays available to screen readers and on hover.
const priorities: Partial<Record<Priority, typeof Equal>> = {
  highest: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
};

const dueLabel = (due: Date) => {
  const days = differenceInCalendarDays(due, TODAY);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return format(due, 'd MMM');
};

const NextItems = () => {
  return (
    <ul className="divide-y divide-line">
      {NEXT_ITEMS.map((item) => {
        const type = types[item.type];
        const TypeIcon = type.icon;
        const PriorityIcon = priorities[item.priority] ?? Equal;
        const urgent = item.priority === 'highest' || item.priority === 'high';
        const due = dueLabel(item.due);
        return (
          <li key={item.key} className="flex items-center gap-4 py-4">
            <span
              role="img"
              aria-label={type.label}
              title={type.label}
              className={`grid size-8 shrink-0 place-items-center rounded-md ${type.className}`}
            >
              <TypeIcon aria-hidden strokeWidth={2} className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-meta text-ink-muted tabular-nums">{item.key}</p>
              <p className="truncate text-body-strong text-ink">{item.title}</p>
            </div>
            <span
              role="img"
              aria-label={`${PRIORITY_LABEL[item.priority]} priority`}
              title={`${PRIORITY_LABEL[item.priority]} priority`}
              className={urgent ? 'text-danger' : 'text-ink'}
            >
              <PriorityIcon aria-hidden strokeWidth={2.5} className="size-5" />
            </span>
            <span className="hidden sm:inline-flex">
              <Badge tone={item.status} />
            </span>
            <span
              className={`w-20 shrink-0 text-right text-meta tabular-nums ${due === 'Today' ? 'font-bold text-danger' : 'text-ink-muted'}`}
            >
              {due}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default NextItems;
