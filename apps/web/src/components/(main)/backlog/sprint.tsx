'use client';

import { useDndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import {
  useGetWorkItemsBySprintId,
  useGetWorkItemsInBacklog,
} from '@sprintstack/api-client/work-items';
import Button from '@ui/button';
import { buttonClass } from '@ui/button/button-class';
import ProgressBar from '@ui/progress-bar';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AlertOctagon, ChevronDown, Ellipsis, GripVertical, ListPlus } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import { useProjectContext } from '@/providers/(main)/project';
import type { Sprint as SprintType } from './data';
import WorkItemRow from './work-item-row';

interface ISprintProps {
  sprint: SprintType;
}

const SortableRow = ({ item }: { item: WorkItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
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
      <WorkItemRow
        item={item}
        link
        handle={
          <button
            ref={setActivatorNodeRef}
            type="button"
            aria-label={`Move ${item.id}`}
            {...attributes}
            {...listeners}
            className={clsx(
              'relative z-10 -ml-2 grid size-8 shrink-0 place-items-center rounded-full text-ink-muted',
              'kbd-focus cursor-grab touch-none transition-colors duration-120 hover:bg-surface-pressed hover:text-ink active:cursor-grabbing',
            )}
          >
            <GripVertical aria-hidden strokeWidth={2} className="size-5" />
          </button>
        }
      />
    </li>
  );
};

const SprintState = ({ state }: { state: SprintType['state'] }) => (
  <span
    className={clsx(
      'inline-flex h-7 shrink-0 items-center rounded-full px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap uppercase tracking-[.03em] font-stretch-condensed',
      state === 'active' ? 'bg-brand text-on-brand' : 'bg-neutral-subtle text-ink-muted',
    )}
  >
    {state}
  </span>
);

const More: React.FC<ISprintProps> = ({ sprint }) => (
  <button
    type="button"
    aria-label={`${sprint.name} actions`}
    className="kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 hover:bg-surface-hover"
  >
    <Ellipsis aria-hidden strokeWidth={2} className="size-5" />
  </button>
);

const Sprint: React.FC<ISprintProps> = ({ sprint }) => {
  const { setNodeRef } = useDroppable({ id: sprint.id });
  const { active, over } = useDndContext();
  const source = active?.data.current?.sortable?.containerId;
  const target = over ? String(over.data.current?.sortable?.containerId ?? over.id) : undefined;
  const isOver = target === sprint.id && source !== sprint.id;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const onCollapsedChange = (collapsed: boolean) => setCollapsed(collapsed);
  const listId = useId();
  const meta =
    sprint?.start &&
    sprint?.end &&
    `${format(sprint.start, 'd MMM')} – ${format(sprint.end, 'd MMM')}`;
  const { projectId } = useProjectContext();
  // The Backlog group isn't a sprint: it lists the project's items no sprint has taken.
  const isBacklog = sprint.id === 'BACKLOG';
  const { data: sprintItems } = useGetWorkItemsBySprintId(isBacklog ? undefined : sprint.id);
  const { data: backlogItems } = useGetWorkItemsInBacklog(isBacklog ? projectId : undefined);
  const items = isBacklog ? backlogItems : sprintItems;
  const points: number = items?.reduce((sum, item) => sum + (item.points ?? 0), 0) ?? 0;
  const overCapacity = points > sprint.capacity;

  if (!items) return null;

  return (
    <section
      ref={setNodeRef}
      aria-label={sprint.name}
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
            aria-label={collapsed ? `Show ${sprint.name}` : `Hide ${sprint.name}`}
            onClick={() => onCollapsedChange(!collapsed)}
            className="kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 hover:bg-surface-hover"
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
          <h2 className="headline text-[2rem] leading-none whitespace-nowrap text-ink">
            {sprint.name}
          </h2>
          <SprintState state={sprint.state} />
          {meta && (
            <span className="hidden truncate text-meta text-ink-muted lg:inline">{meta}</span>
          )}
          <span className="ml-auto lg:hidden">
            <More sprint={sprint} />
          </span>
        </div>
        {meta && <p className="-mt-1 text-meta text-ink-muted lg:hidden">{meta}</p>}
        {sprint.capacity > 0 && (
          <div className="flex items-center gap-4">
            {overCapacity && <AlertOctagon className="size-6 text-danger" />}
            <div className="flex-1 lg:w-48 lg:flex-none">
              <ProgressBar
                label={`${sprint.name} capacity`}
                value={(points / sprint.capacity) * 100}
                color={overCapacity ? 'danger' : 'primary'}
              />
            </div>
            <span
              className={clsx(
                'text-meta whitespace-nowrap tabular-nums',
                overCapacity ? 'text-danger' : 'text-ink-muted',
              )}
            >
              {points} / {sprint.capacity} pts
            </span>
          </div>
        )}
        {sprint.state === 'active' ? (
          <Link href="/taskboard" className={buttonClass('secondary', 'sm')}>
            Open taskboard
          </Link>
        ) : (
          <Button variant="primary" size="sm">
            Start sprint
          </Button>
        )}
        <span className="hidden lg:block">
          <More sprint={sprint} />
        </span>
      </header>
      <div id={listId} hidden={collapsed}>
        <SortableContext
          // Rows report this id as their containerId, so a drop on a row resolves to its sprint.
          id={sprint.id}
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items?.length > 0 && (
            <ul className="divide-y divide-line border-t border-line">
              {items?.map((item) => (
                <SortableRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </SortableContext>
        {(sprint.state === 'planned' || items?.length === 0) && (
          <div className="border-t border-line p-4 lg:px-5">
            <p
              className={clsx(
                'flex min-h-24 items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed px-4 text-center text-body-strong text-ink-muted transition-colors duration-120 font-stretch-semi-condensed',
                isOver ? 'border-ink bg-surface-hover text-ink' : 'border-line-strong',
              )}
            >
              <ListPlus aria-hidden strokeWidth={2} className="size-5 shrink-0" />
              {`Drag items here to add them to ${sprint.name}`}
            </p>
          </div>
        )}
        {/* {footer} */}
      </div>
    </section>
  );
};

export default Sprint;
