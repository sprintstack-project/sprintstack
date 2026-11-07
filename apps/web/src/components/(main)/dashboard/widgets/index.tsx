'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { type ReactNode, useId, useState } from 'react';
import { SPRINT } from '../data';
import Widget from '../widget';

export type WidgetKey = 'next-items' | 'activity' | 'burndown' | 'status';

const WIDGETS: Record<WidgetKey, { title: string; href: string }> = {
  'next-items': { title: 'Your next items', href: '/backlog' },
  activity: { title: 'Recent activity', href: '/team' },
  burndown: { title: `Burndown · ${SPRINT.name}`, href: '/timeline' },
  status: { title: 'Work item status', href: '/taskboard' },
};

const DEFAULT_WIDGETS = Object.keys(WIDGETS) as WidgetKey[];

interface WidgetsProps {
  /**
   * Each widget's body, rendered on the server (with its own Suspense boundary) and passed in, so
   * dragging and removing stay on the client while the data streams from the server.
   */
  content: Record<WidgetKey, ReactNode>;
}

const Widgets = ({ content }: WidgetsProps) => {
  const [widgets, setWidgets] = useState<WidgetKey[]>(DEFAULT_WIDGETS);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setWidgets((all) =>
      arrayMove(all, all.indexOf(active.id as WidgetKey), all.indexOf(over.id as WidgetKey)),
    );
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={widgets} strategy={rectSortingStrategy}>
        <div className="grid gap-4 xl:grid-cols-2">
          {widgets.map((key) => (
            <Widget
              key={key}
              id={key}
              title={WIDGETS[key].title}
              href={WIDGETS[key].href}
              onRemove={() => setWidgets((all) => all.filter((k) => k !== key))}
            >
              {content[key]}
            </Widget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Widgets;
