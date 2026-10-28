'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import { ChevronDown, Ellipsis, GripVertical, ListPlus } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import type { WorkItem } from '../taskboard/data';
import ItemRow from './item-row';

export const grip =
  'relative z-10 -ml-2 grid size-8 shrink-0 place-items-center rounded-full text-ink-muted';
export const gripIcon = <GripVertical aria-hidden strokeWidth={2} className="size-5" />;

const iconButton =
  'kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 hover:bg-surface-hover';

const SortableRow = ({ item }: { item: WorkItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={clsx(
        // The row links to its item; only the handle drags.
        'relative bg-surface px-4 py-4 transition-colors duration-120 hover:bg-surface-hover lg:px-5',
        // The original stays as a placeholder while its copy follows the pointer.
        isDragging && 'opacity-40',
      )}
    >
      <ItemRow
        item={item}
        link
        handle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            aria-label={`Move ${item.key}`}
            {...attributes}
            {...listeners}
            className={clsx(
              grip,
              'kbd-focus cursor-grab touch-none transition-colors duration-120 hover:bg-surface-pressed hover:text-ink active:cursor-grabbing',
            )}
          >
            {gripIcon}
          </button>
        }
      />
    </li>
  );
};

interface GroupProps {
  /** The sprint id, or BACKLOG; also the drop target's id. */
  id: string;
  title: string;
  /** After the title, e.g. the sprint's state. */
  badge?: ReactNode;
  /** Muted text after the title (below it on narrow screens), e.g. the sprint's dates. */
  meta?: string;
  /** Before the action, e.g. the points against capacity. */
  aside?: ReactNode;
  action?: ReactNode;
  /** The items the filters leave, in rank order. */
  items: WorkItem[];
  /** The drop hint under the rows. Shown when the group is empty, and always with `alwaysHint`. */
  hint: string;
  alwaysHint?: boolean;
  /** Under the rows, e.g. "Show more". */
  footer?: ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

/**
 * A sprint or the backlog: a collapsible card of ranked rows. The whole card takes dropped items,
 * so a collapsed or empty group still takes them.
 */
const Group = ({
  id,
  title,
  badge,
  meta,
  aside,
  action,
  items,
  hint,
  alwaysHint,
  footer,
  collapsed,
  onCollapsedChange,
}: GroupProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const listId = useId();
  const more = (
    <button type="button" aria-label={`${title} actions`} className={iconButton}>
      <Ellipsis aria-hidden strokeWidth={2} className="size-5" />
    </button>
  );

  return (
    <section
      ref={setNodeRef}
      aria-label={title}
      className={clsx(
        'overflow-hidden rounded-2xl border bg-surface transition-colors duration-120',
        isOver ? 'border-ink' : 'border-line',
      )}
    >
      <header className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-6 lg:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={listId}
            aria-label={collapsed ? `Show ${title}` : `Hide ${title}`}
            onClick={() => onCollapsedChange(!collapsed)}
            className={iconButton}
          >
            <ChevronDown
              aria-hidden
              strokeWidth={2}
              className={clsx(
                'size-5 transition-transform duration-120',
                collapsed && '-rotate-90',
              )}
            />
          </button>
          <h2 className="headline text-[2rem] leading-none whitespace-nowrap text-ink">{title}</h2>
          {badge}
          {meta && (
            <span className="hidden truncate text-meta text-ink-muted lg:inline">{meta}</span>
          )}
          <span className="ml-auto lg:hidden">{more}</span>
        </div>
        {meta && <p className="-mt-1 text-meta text-ink-muted lg:hidden">{meta}</p>}
        {aside}
        {action}
        <span className="hidden lg:block">{more}</span>
      </header>
      <div id={listId} hidden={collapsed}>
        <SortableContext items={items.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          {items.length > 0 && (
            <ul className="divide-y divide-line border-t border-line">
              {items.map((item) => (
                <SortableRow key={item.key} item={item} />
              ))}
            </ul>
          )}
        </SortableContext>
        {(alwaysHint || items.length === 0) && (
          <div className="border-t border-line p-4 lg:px-5">
            <p
              className={clsx(
                'flex min-h-24 items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed px-4 text-center text-body-strong text-ink-muted transition-colors duration-120 font-stretch-semi-condensed',
                isOver ? 'border-ink bg-surface-hover text-ink' : 'border-line-strong',
              )}
            >
              <ListPlus aria-hidden strokeWidth={2} className="size-5 shrink-0" />
              {hint}
            </p>
          </div>
        )}
        {footer}
      </div>
    </section>
  );
};

export default Group;
