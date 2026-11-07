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
import type { WidgetKey } from '@sprintstack/shared/dashboard-widgets';
import { type ReactNode, Suspense, useId } from 'react';
import { useDashboardContext } from '@/providers/(main)/dashboard';
import type { Burndown as BurndownData, StatusSummary } from '../data';
import { type ActivityGroup, SPRINT, type WorkItem } from '../data';
import ErrorWrapper from '../error-wrapper';
import {
  ActivitySkeleton,
  BurndownSkeleton,
  NextItemsSkeleton,
  WorkStatusSkeleton,
} from '../skeletons';
import Burndown from './burndown';
import DraggableWidget from './draggable-widget';
import NextItems from './next-items';
import RecentActivity from './recent-activity';
import WorkStatus from './work-status';

const WIDGETS: Record<WidgetKey, { title: string; href: string }> = {
  'next-items': { title: 'Your next items', href: '/backlog' },
  activity: { title: 'Recent activity', href: '/team' },
  burndown: { title: `Burndown · ${SPRINT.name}`, href: '/timeline' },
  status: { title: 'Work item status', href: '/taskboard' },
};

/** Each widget's data, as a promise the route starts without awaiting. */
interface WidgetsProps {
  nextItems: Promise<WorkItem[]>;
  activity: Promise<ActivityGroup[]>;
  burndown: Promise<BurndownData>;
  status: Promise<StatusSummary>;
}

/** The widget behind its own error boundary, with its skeleton until its data lands. */
const body = (label: string, skeleton: ReactNode, widget: ReactNode) => (
  <ErrorWrapper label={label}>
    <Suspense fallback={skeleton}>{widget}</Suspense>
  </ErrorWrapper>
);

const Widgets = ({ nextItems, activity, burndown, status }: WidgetsProps) => {
  const { widgets, rearrangeWidgets } = useDashboardContext();

  const content: Record<WidgetKey, ReactNode> = {
    'next-items': body('your next items', <NextItemsSkeleton />, <NextItems items={nextItems} />),
    activity: body('recent activity', <ActivitySkeleton />, <RecentActivity activity={activity} />),
    burndown: body('the burndown', <BurndownSkeleton />, <Burndown burndown={burndown} />),
    status: body('work item status', <WorkStatusSkeleton />, <WorkStatus status={status} />),
  };

  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    rearrangeWidgets(
      arrayMove(
        widgets,
        widgets.indexOf(active.id as WidgetKey),
        widgets.indexOf(over.id as WidgetKey),
      ),
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
            <DraggableWidget
              key={key}
              id={key}
              title={WIDGETS[key].title}
              href={WIDGETS[key].href}
              onRemove={() => rearrangeWidgets(widgets.filter((k) => k !== key))}
            >
              {content[key]}
            </DraggableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Widgets;
