'use client';

import {
  type Announcements,
  type CollisionDetection,
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  type Over,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import { useGetAllSprints } from '@sprintstack/api-client/sprints';
import { useGetWorkItemsByProjectId, useUpdateWorkItem } from '@sprintstack/api-client/work-items';
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import { useId, useState } from 'react';
import { useProjectContext } from '@/providers/(main)/project';
import Sprint from './sprint';
import WorkItemRow from './work-item-row';

// Prefer whatever is under the pointer; fall back for the keyboard sensor, which has no pointer.
const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : closestCorners(args);
};

const BacklogDndList = () => {
  const dndId = useId();
  const [active, setActive] = useState<WorkItem | null>(null);
  const { projectId } = useProjectContext();

  const { data: workItems } = useGetWorkItemsByProjectId(projectId);

  const { data: sprints } = useGetAllSprints(projectId);
  const plannedSprints = (sprints ?? []).filter((sprint) => sprint.state !== 'closed');

  const [, updateWorkItem] = useUpdateWorkItem();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const placeName = (over: Over | null) => {
    const target = over ? String(over.data.current?.sortable?.containerId ?? over.id) : undefined;
    if (target === 'BACKLOG') return 'Backlog';
    return plannedSprints.find((sprint) => sprint.id === target)?.name ?? 'nowhere';
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${active.id}.`,
    onDragOver: ({ active, over }) => `${active.id} is over ${placeName(over)}.`,
    onDragEnd: ({ active, over }) =>
      over ? `${active.id} dropped in ${placeName(over)}.` : `${active.id} put back.`,
    onDragCancel: ({ active }) => `Moving ${active.id} was cancelled.`,
  };

  const onDragStart = (event: DragStartEvent) => {
    setActive(workItems?.find((item) => item.id === event.active.id) ?? null);
  };
  const onDragEnd = ({ active: dragged, over }: DragEndEvent) => {
    setActive(null);
    const target = over ? String(over.data.current?.sortable?.containerId ?? over.id) : undefined;
    if (!target) return;
    const sprintId = target === 'BACKLOG' ? null : target;
    const item = workItems?.find((i) => i.id === dragged.id);
    if (!item || (item.sprintId ?? null) === sprintId) return;
    updateWorkItem({ input: { id: item.id, sprintId } });
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={{ announcements }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActive(null)}
    >
      <div className="flex flex-col gap-6">
        {plannedSprints.map((sprint) => (
          <Sprint key={sprint.id} sprint={sprint} />
        ))}
        <Sprint
          sprint={{
            id: 'BACKLOG',
            name: 'Backlog',
            capacity: 0,
            state: 'active',
          }}
        />
      </div>
      <DragOverlay>
        {active && (
          <div className="cursor-grabbing rounded-xl border border-ink bg-surface px-4 py-4 shadow-popover ring-1 ring-ink lg:px-5">
            <WorkItemRow
              item={active}
              handle={
                <span
                  className={clsx(
                    'relative z-10 -ml-2 grid size-8 shrink-0 place-items-center rounded-full text-ink-muted',
                    'text-ink',
                  )}
                >
                  <GripVertical aria-hidden strokeWidth={2} className="size-5" />
                </span>
              }
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BacklogDndList;
