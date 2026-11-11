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
import clsx from 'clsx';
import { GripVertical } from 'lucide-react';
import { useId, useState } from 'react';
import { SPRINTS } from '../backlog/data';
import Sprint from './sprint';
import WorkItemRow from './work-item-row';

const BacklogDndList = () => {
  const dndId = useId();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = null; //TBD

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const placeName = (id: UniqueIdentifier | undefined) => {}; //TBD

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${active.id}.`,
    onDragOver: ({ active, over }) => `${active.id} is over ${placeName(over?.id)}.`,
    onDragEnd: ({ active, over }) =>
      over ? `${active.id} dropped in ${placeName(over.id)}.` : `${active.id} put back.`,
    onDragCancel: ({ active }) => `Moving ${active.id} was cancelled.`,
  };

  const onDragStart = (event: DragStartEvent) => {};
  const onDragOver = (event: DragOverEvent) => {};
  const onDragEnd = (event: DragEndEvent) => {};

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
      <div className="flex flex-col gap-6">
        {SPRINTS.map((sprint) => (
          <Sprint key={sprint.id} sprint={sprint} />
        ))}
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
