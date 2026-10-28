import { Badge } from '@ui/badge';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { itemHref, type WorkItem } from './data';
import { Avatar, Points, PriorityIcon, stretchedLink, Tag, TypeIcon } from './parts';

/**
 * A work item on the Kanban board. The column names the status, so only Blocked gets a badge.
 * With `link` the title links to the item and covers the card, so put it in a `relative` box.
 */
const BoardCard = ({
  item,
  link,
  handle,
}: {
  item: WorkItem;
  link?: boolean;
  /** The drag handle, at the start of the top row. */
  handle?: ReactNode;
}) => {
  const title =
    'font-display text-[1.25rem] leading-6 font-extrabold text-ink font-stretch-condensed';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {handle}
        <TypeIcon type={item.type} />
        <span className="flex-1 text-meta text-ink-muted tabular-nums">{item.key}</span>
        <PriorityIcon level={item.priority} />
      </div>
      {link ? (
        <Link href={itemHref(item.key)} className={`${stretchedLink} ${title}`}>
          {item.title}
        </Link>
      ) : (
        <p className={title}>{item.title}</p>
      )}
      {item.progress !== undefined && (
        <div
          role="progressbar"
          aria-label="Subtasks done"
          aria-valuenow={item.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-brand" style={{ width: `${item.progress}%` }} />
        </div>
      )}
      {item.status === 'danger' && (
        <span className="flex">
          <Badge tone="danger" />
        </span>
      )}
      <div className="flex items-center gap-2">
        <span className="flex min-w-0 flex-1 flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </span>
        <Points points={item.points} />
        <Avatar person={item.assignee} size="sm" />
      </div>
    </div>
  );
};

export default BoardCard;
