import { Badge } from '@ui/badge';
import Link from 'next/link';
import { itemHref, type WorkItem } from './data';
import ItemCard from './item-card';
import { Avatar, Points, PriorityIcon, stretchedLink, Tag, TypeIcon } from './parts';

const th = 'eyebrow h-16 px-5 text-left align-middle first:pl-6 last:pr-6';
const td = 'h-20 px-5 align-middle first:pl-6 last:pr-6';

const row =
  'relative cursor-pointer transition-colors duration-120 hover:bg-surface-hover active:bg-surface-pressed';

/** A table on wide screens; on narrow ones the same items stack as cards. Rows link to their item. */
const ListView = ({ items }: { items: WorkItem[] }) => {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong p-10 text-center text-body-strong text-ink-muted">
        No work items match these filters.
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface lg:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Work items</caption>
          <colgroup>
            <col className="w-40" />
            <col />
            <col className="w-40" />
            <col className="w-36" />
            <col className="w-52" />
            <col className="w-20" />
            <col className="w-48" />
          </colgroup>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className={th}>
                Work item
              </th>
              <th scope="col" className={th}>
                Title
              </th>
              <th scope="col" className={th}>
                Status
              </th>
              <th scope="col" className={th}>
                Priority
              </th>
              <th scope="col" className={th}>
                Assignee
              </th>
              <th scope="col" className={`${th} text-center`}>
                Pts
              </th>
              <th scope="col" className={th}>
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((item) => (
              <tr key={item.key} className={row}>
                <td className={td}>
                  <span className="flex items-center gap-3">
                    <TypeIcon type={item.type} />
                    <span className="text-body-strong text-ink tabular-nums">{item.key}</span>
                  </span>
                </td>
                <th scope="row" className={`${td} text-left`}>
                  <Link
                    href={itemHref(item.key)}
                    title={item.title}
                    className={`${stretchedLink} block truncate text-body-strong text-ink font-stretch-semi-condensed`}
                  >
                    {item.title}
                  </Link>
                </th>
                <td className={td}>
                  <Badge tone={item.status} />
                </td>
                <td className={td}>
                  <PriorityIcon level={item.priority} label />
                </td>
                <td className={td}>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar person={item.assignee} />
                    <span
                      className={`truncate text-body-strong font-stretch-semi-condensed ${item.assignee ? 'text-ink' : 'text-ink-muted'}`}
                    >
                      {item.assignee?.name ?? 'Unassigned'}
                    </span>
                  </span>
                </td>
                <td className={td}>
                  <span className="flex justify-center">
                    <Points points={item.points} />
                  </span>
                </td>
                <td className={td}>
                  <span className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface lg:hidden">
        {items.map((item) => (
          <li key={item.key} className={`${row} p-5`}>
            <ItemCard item={item} link />
          </li>
        ))}
      </ul>
    </>
  );
};

export default ListView;
