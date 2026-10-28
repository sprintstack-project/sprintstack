'use client';

import {
  type Announcements,
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { STATUS_LABEL } from '@lib/status';
import type { StatusTone } from '@ui/types';
import { clsx } from 'clsx';
import { GripVertical, Plus } from 'lucide-react';
import { useId, useState } from 'react';
import BoardCard from './board-card';
import { COLUMNS, columnOf, type WorkItem } from './data';

type Update = (all: WorkItem[]) => WorkItem[];

const card = 'rounded-xl border border-line bg-surface p-4';

const grip =
  'relative z-10 -ml-2 grid size-8 shrink-0 place-items-center rounded-full text-ink-muted';
const gripIcon = <GripVertical aria-hidden strokeWidth={2} className="size-5" />;

const isColumn = (id: UniqueIdentifier): id is StatusTone => COLUMNS.includes(id as StatusTone);

/**
 * Moves `key` into `status`, just before `beforeKey` (or to the end of the list). The board shows
 * each column in list order, so this is also its place in the column.
 */
const moveTo =
  (key: string, status: StatusTone, beforeKey: string | null): Update =>
  (all) => {
    const item = all.find((i) => i.key === key);
    if (!item) return all;
    const rest = all.filter((i) => i.key !== key);
    const at = beforeKey ? rest.findIndex((i) => i.key === beforeKey) : -1;
    rest.splice(at === -1 ? rest.length : at, 0, { ...item, status });
    return rest;
  };

const SortableCard = ({ item }: { item: WorkItem }) => {
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
        card,
        // The card links to its item; only the handle drags.
        'relative transition-[border-color,box-shadow] duration-120 hover:border-ink hover:ring-1 hover:ring-ink',
        // The original stays as a placeholder while its copy follows the pointer.
        isDragging && 'opacity-40',
      )}
    >
      <BoardCard
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

const Column = ({
  tone,
  items,
  addable,
}: {
  tone: StatusTone;
  items: WorkItem[];
  /** Ends the column with an "Add item" button (the first column, where new work lands). */
  addable?: boolean;
}) => {
  // The column itself is a drop target too, so an empty column (or the space below the last card)
  // still takes a card.
  const { setNodeRef, isOver } = useDroppable({ id: tone });
  const points = items.reduce((sum, item) => sum + item.points, 0);
  return (
    <section
      aria-label={STATUS_LABEL[tone]}
      className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-4"
    >
      <header className="flex items-center gap-3 px-1 pt-1 pb-1">
        <h2 className="headline text-title text-ink">{STATUS_LABEL[tone]}</h2>
        <span className="grid size-6 place-items-center rounded-full bg-ink text-[0.8125rem] font-extrabold text-on-ink tabular-nums">
          {items.length}
        </span>
        <span className="flex-1 text-right text-meta text-ink-muted tabular-nums">
          {points} pts
        </span>
      </header>
      <SortableContext items={items.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={clsx(
            'flex min-h-24 flex-col gap-3 rounded-xl transition-colors duration-120',
            isOver && items.length === 0 && 'bg-surface-hover',
          )}
        >
          {items.length === 0 && (
            <li className="rounded-xl border border-dashed border-line-strong p-6 text-center text-meta text-ink-muted">
              Nothing here
            </li>
          )}
          {items.map((item) => (
            <SortableCard key={item.key} item={item} />
          ))}
        </ul>
      </SortableContext>
      {addable && (
        <button
          type="button"
          className="kbd-focus flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line-strong text-body-strong text-ink-muted transition-colors duration-120 font-stretch-semi-condensed hover:border-ink-muted hover:text-ink"
        >
          <Plus aria-hidden strokeWidth={2} className="size-5" />
          Add item
        </button>
      )}
    </section>
  );
};

interface KanbanViewProps {
  items: WorkItem[];
  /** Applies a move to the full list (filters may be hiding some of it). */
  onItemsChange: (update: Update) => void;
}

/**
 * One column per stage, sharing the width and scrolling sideways when they don't fit. Cards move by
 * their handle.
 */
const KanbanView = ({ items, onItemsChange }: KanbanViewProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // A stable id keeps dnd-kit's generated aria ids the same on the server and the client.
  const dndId = useId();
  const active = items.find((i) => i.key === activeKey);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** The column a card or column id belongs to. */
  const statusOf = (id: UniqueIdentifier) => {
    if (isColumn(id)) return id;
    const item = items.find((i) => i.key === id);
    return item && columnOf(item.status);
  };

  const columnName = (id: UniqueIdentifier | undefined) => {
    const status = id === undefined ? undefined : statusOf(id);
    return status ? STATUS_LABEL[status] : 'nowhere';
  };

  // Screen readers hear columns by name rather than dnd-kit's raw ids.
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${active.id}.`,
    onDragOver: ({ active, over }) => `${active.id} is over ${columnName(over?.id)}.`,
    onDragEnd: ({ active, over }) =>
      over ? `${active.id} dropped in ${columnName(over.id)}.` : `${active.id} put back.`,
    onDragCancel: ({ active }) => `Moving ${active.id} was cancelled.`,
  };

  const onDragStart = ({ active }: DragStartEvent) => setActiveKey(String(active.id));

  // Crossing into another column moves the card there straight away, so the column opens a gap.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = statusOf(active.id);
    const to = statusOf(over.id);
    if (!from || !to || from === to) return;
    onItemsChange(moveTo(String(active.id), to, isColumn(over.id) ? null : String(over.id)));
  };

  // Within a column, the drop sets the order.
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveKey(null);
    if (!over || active.id === over.id || isColumn(over.id)) return;
    onItemsChange((all) => {
      const from = all.findIndex((i) => i.key === active.id);
      const to = all.findIndex((i) => i.key === over.id);
      return from === -1 || to === -1 ? all : arrayMove(all, from, to);
    });
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCorners}
      accessibility={{ announcements }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveKey(null)}
    >
      <div className="-mx-4 grid auto-cols-[minmax(17rem,1fr)] grid-flow-col items-start gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
        {COLUMNS.map((tone, i) => (
          <Column
            key={tone}
            tone={tone}
            items={items.filter((item) => columnOf(item.status) === tone)}
            addable={i === 0}
          />
        ))}
      </div>
      <DragOverlay>
        {active && (
          <div className={clsx(card, 'cursor-grabbing border-ink shadow-popover ring-1 ring-ink')}>
            <BoardCard
              item={active}
              handle={<span className={clsx(grip, 'text-ink')}>{gripIcon}</span>}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanView;
