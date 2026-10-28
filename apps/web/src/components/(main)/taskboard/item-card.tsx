import { Badge } from '@ui/badge';
import Link from 'next/link';
import { itemHref, type WorkItem } from './data';
import { Avatar, Points, PriorityIcon, stretchedLink, Tag, TypeIcon } from './parts';

/**
 * A work item stacked for the list on small screens. With `link` the title links to the item and
 * covers the card, so put the card in a `relative` box.
 */
const ItemCard = ({ item, link }: { item: WorkItem; link?: boolean }) => {
  const title =
    'font-display text-[1.25rem] leading-6 font-extrabold text-ink font-stretch-condensed';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <TypeIcon type={item.type} />
        <span className="text-meta text-ink-muted tabular-nums">{item.key}</span>
        <PriorityIcon level={item.priority} />
        <span className="flex-1" />
        <Points points={item.points} />
        <Avatar person={item.assignee} size="sm" />
      </div>
      {link ? (
        <Link href={itemHref(item.key)} className={`${stretchedLink} ${title}`}>
          {item.title}
        </Link>
      ) : (
        <p className={title}>{item.title}</p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={item.status} />
        {item.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  );
};

export default ItemCard;
