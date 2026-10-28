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
import { Button } from '@ui/button';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { type ReactNode, useId, useState } from 'react';
import Burndown from './burndown';
import { SPRINT, TODAY, USER } from './data';
import NextItems from './next-items';
import RecentActivity from './recent-activity';
import SummaryTiles from './summary-tiles';
import Widget from './widget';
import WorkStatus from './work-status';

type WidgetKey = 'next-items' | 'activity' | 'burndown' | 'status';

const WIDGETS: Record<WidgetKey, { title: string; href: string; content: ReactNode }> = {
  'next-items': { title: 'Your next items', href: '/backlog', content: <NextItems /> },
  activity: { title: 'Recent activity', href: '/team', content: <RecentActivity /> },
  burndown: { title: `Burndown · ${SPRINT.name}`, href: '/timeline', content: <Burndown /> },
  status: { title: 'Work item status', href: '/taskboard', content: <WorkStatus /> },
};

const DEFAULT_WIDGETS = Object.keys(WIDGETS) as WidgetKey[];

const DashboardPage = () => {
  // Layout isn't saved yet: a reload brings back the default widgets in the default order.
  const [widgets, setWidgets] = useState<WidgetKey[]>(DEFAULT_WIDGETS);
  const removed = DEFAULT_WIDGETS.filter((key) => !widgets.includes(key));
  // A stable id keeps dnd-kit's generated aria ids the same on the server and the client.
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
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">{format(TODAY, 'eeee, d MMMM')}</p>
          <h1 className="headline text-7xl leading-none">
            Hello, <span className="text-brand-ink">{USER.firstName}.</span>
          </h1>
        </div>
        {/* Brings back a removed widget; a picker can replace this once there are more. */}
        <Button
          icon={PlusIcon}
          disabled={removed.length === 0}
          onClick={() => setWidgets((all) => [...all, removed[0]])}
        >
          Add widget
        </Button>
      </div>
      <SummaryTiles />
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
                {WIDGETS[key].content}
              </Widget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DashboardPage;
