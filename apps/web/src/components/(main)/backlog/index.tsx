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
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Button, buttonClass } from '@ui/button';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import {
  BACKLOG,
  BACKLOG_PAGE,
  filterItems,
  moveTo,
  NO_FILTERS,
  PLANNED_ITEMS,
  type PlannedItem,
  SPRINTS,
  type Sprint,
  sumPoints,
} from './data';
import Group, { grip, gripIcon } from './group';
import ItemRow from './item-row';
import Toolbar from './toolbar';

const GROUPS = [...SPRINTS.map((s) => s.id), BACKLOG];

const isGroup = (id: UniqueIdentifier) => GROUPS.includes(String(id));

const groupName = (group: string) => SPRINTS.find((s) => s.id === group)?.name ?? 'Backlog';

const SprintState = ({ state }: { state: Sprint['state'] }) => (
  <span
    className={clsx(
      'inline-flex h-7 shrink-0 items-center rounded-full px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap uppercase tracking-[.03em] font-stretch-condensed',
      state === 'active' ? 'bg-brand text-on-brand' : 'bg-neutral-subtle text-ink-muted',
    )}
  >
    {state}
  </span>
);

/** Points planned into the sprint against what the team can take; red once it's over. */
const Capacity = ({ sprint, points }: { sprint: Sprint; points: number }) => {
  const over = points > sprint.capacity;
  return (
    <div className="flex items-center gap-4">
      <div
        role="progressbar"
        aria-label={`${sprint.name} capacity`}
        aria-valuenow={points}
        aria-valuemin={0}
        aria-valuemax={sprint.capacity}
        aria-valuetext={`${points} of ${sprint.capacity} points`}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line lg:w-48 lg:flex-none"
      >
        <div
          className={clsx('h-full rounded-full', over ? 'bg-danger' : 'bg-ink')}
          style={{ width: `${Math.min(100, (points / sprint.capacity) * 100)}%` }}
        />
      </div>
      <span
        className={clsx(
          'text-meta whitespace-nowrap tabular-nums',
          over ? 'text-danger' : 'text-ink-muted',
        )}
      >
        {points} / {sprint.capacity} pts
      </span>
    </div>
  );
};

const Backlog = () => {
  const [allItems, setAllItems] = useState(PLANNED_ITEMS);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // A stable id keeps dnd-kit's generated aria ids the same on the server and the client.
  const dndId = useId();

  const items = filterItems(allItems, filters);
  const inGroup = (group: string) => items.filter((i) => i.group === group);
  const backlog = inGroup(BACKLOG);
  const backlogShown = showAll ? backlog : backlog.slice(0, BACKLOG_PAGE);
  const backlogHidden = backlog.length - backlogShown.length;
  const unplanned = allItems.filter((i) => i.group === BACKLOG).length;
  const active = allItems.find((i) => i.key === activeKey);

  const collapse = (group: string) => ({
    collapsed: collapsed.includes(group),
    onCollapsedChange: (next: boolean) =>
      setCollapsed((all) => (next ? [...all, group] : all.filter((g) => g !== group))),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** The group a row or group id belongs to. */
  const groupOf = (id: UniqueIdentifier) =>
    isGroup(id) ? String(id) : allItems.find((i) => i.key === id)?.group;

  const placeName = (id: UniqueIdentifier | undefined) => {
    const group = id === undefined ? undefined : groupOf(id);
    return group ? groupName(group) : 'nowhere';
  };

  // Screen readers hear groups by name rather than dnd-kit's raw ids.
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${active.id}.`,
    onDragOver: ({ active, over }) => `${active.id} is over ${placeName(over?.id)}.`,
    onDragEnd: ({ active, over }) =>
      over ? `${active.id} dropped in ${placeName(over.id)}.` : `${active.id} put back.`,
    onDragCancel: ({ active }) => `Moving ${active.id} was cancelled.`,
  };

  const onDragStart = ({ active }: DragStartEvent) => setActiveKey(String(active.id));

  // Crossing into another group moves the row there straight away, so the group opens a gap.
  // Dropped on the group itself, it goes after the rows shown (ahead of any behind "Show more").
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const from = groupOf(active.id);
    const to = groupOf(over.id);
    if (!from || !to || from === to) return;
    const before = isGroup(over.id)
      ? to === BACKLOG && backlogHidden > 0
        ? backlog[backlogShown.length].key
        : null
      : String(over.id);
    setAllItems(moveTo(String(active.id), to, before));
  };

  // Within a group, the drop sets the rank.
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveKey(null);
    if (!over || active.id === over.id || isGroup(over.id)) return;
    setAllItems((all) => {
      const from = all.findIndex((i) => i.key === active.id);
      const to = all.findIndex((i) => i.key === over.id);
      return from === -1 || to === -1 ? all : arrayMove(all, from, to);
    });
  };

  const sprintGroup = (sprint: Sprint) => {
    const planned: PlannedItem[] = allItems.filter((i) => i.group === sprint.id);
    return (
      <Group
        key={sprint.id}
        id={sprint.id}
        title={sprint.name}
        badge={<SprintState state={sprint.state} />}
        meta={`${format(sprint.start, 'd MMM')} – ${format(sprint.end, 'd MMM')}`}
        aside={<Capacity sprint={sprint} points={sumPoints(planned)} />}
        action={
          sprint.state === 'active' ? (
            <Link href="/taskboard" className={buttonClass('secondary', 'sm')}>
              Open taskboard
            </Link>
          ) : (
            <Button variant="primary" size="sm">
              Start sprint
            </Button>
          )
        }
        items={inGroup(sprint.id)}
        hint={`Drag items here to add them to ${sprint.name}`}
        // Planning happens in the sprints not yet started, so they always show where to drop.
        alwaysHint={sprint.state === 'planned'}
        {...collapse(sprint.id)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            {unplanned} items unplanned · {SPRINTS.length} sprints
          </p>
          <h1 className="headline text-7xl leading-none">Backlog</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="lg" icon={PlusIcon}>
            New sprint
          </Button>
          <Button variant="brand" size="lg" icon={PlusIcon}>
            New work item
          </Button>
        </div>
      </div>
      <Toolbar filters={filters} onFiltersChange={setFilters} />
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
        <div className="flex flex-col gap-6">
          {SPRINTS.map(sprintGroup)}
          <Group
            id={BACKLOG}
            title="Backlog"
            meta="Ranked by priority"
            aside={
              <p aria-live="polite" className="text-meta text-ink-muted tabular-nums">
                {backlogShown.length} of {backlog.length} shown · {sumPoints(backlogShown)} pts
              </p>
            }
            action={
              <Button variant="secondary" size="sm" icon={PlusIcon}>
                Create item
              </Button>
            }
            items={backlogShown}
            hint={
              backlog.length === 0 && unplanned > 0
                ? 'No backlog items match these filters'
                : 'Drag items here to move them back to the backlog'
            }
            footer={
              backlog.length > BACKLOG_PAGE && (
                <div className="border-t border-line p-2">
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="kbd-focus h-12 w-full cursor-pointer rounded-xl text-[1.0625rem] leading-5 font-extrabold text-ink transition-colors duration-120 font-stretch-condensed hover:bg-surface-hover"
                  >
                    {showAll ? 'Show fewer' : `Show ${backlogHidden} more`}
                  </button>
                </div>
              )
            }
            {...collapse(BACKLOG)}
          />
        </div>
        <DragOverlay>
          {active && (
            <div className="cursor-grabbing rounded-xl border border-ink bg-surface px-4 py-4 shadow-popover ring-1 ring-ink lg:px-5">
              <ItemRow
                item={active}
                handle={<span className={clsx(grip, 'text-ink')}>{gripIcon}</span>}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Backlog;
