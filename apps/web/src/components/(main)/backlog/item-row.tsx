import { Badge } from '@ui/badge';
import { clsx } from 'clsx';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { itemHref, type WorkItem } from '../taskboard/data';
import { Avatar, Points, PriorityIcon, stretchedLink, TypeIcon } from '../taskboard/parts';

/**
 * A backlog row: one line on wide screens; on narrow ones the title drops under the key and the
 * status is left out. With `link` the title links to the item and covers the row, so put it in a
 * `relative` box.
 */
const ItemRow = ({
  item,
  link,
  handle,
}: {
  item: WorkItem;
  link?: boolean;
  /** The drag handle, at the start of the row. */
  handle?: ReactNode;
}) => {
  const title =
    'truncate text-body-strong text-ink font-stretch-semi-condensed lg:text-[1.0625rem]';
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      {handle}
      <TypeIcon type={item.type} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-row lg:items-center lg:gap-6">
        <span className="flex items-center gap-2 lg:w-28 lg:shrink-0">
          <span className="text-meta text-ink-muted tabular-nums lg:text-body-strong lg:text-ink">
            {item.key}
          </span>
          <span className="flex lg:hidden">
            <PriorityIcon level={item.priority} />
          </span>
        </span>
        {link ? (
          <Link href={itemHref(item.key)} title={item.title} className={clsx(stretchedLink, title)}>
            {item.title}
          </Link>
        ) : (
          <p className={title}>{item.title}</p>
        )}
      </div>
      <span className="hidden w-36 shrink-0 lg:flex">
        <Badge tone={item.status} />
      </span>
      <span className="hidden w-10 shrink-0 justify-center lg:flex">
        <PriorityIcon level={item.priority} />
      </span>
      <Points points={item.points} />
      <Avatar person={item.assignee} size="sm" />
    </div>
  );
};

export default ItemRow;
