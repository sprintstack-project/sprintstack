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
import { useGetAllActivities } from '@sprintstack/api-client/activity';
import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import { useGetMe } from '@sprintstack/api-client/users';
import {
  useGetWorkItemsByAssignee,
  useGetWorkItemsByProjectId,
} from '@sprintstack/api-client/work-items';
import type { WidgetKey } from '@sprintstack/shared/dashboard-widgets';
import { useDashboardContext } from '@sprintstack/shared/providers/main/dashboard';
import { type ReactNode, Suspense, useId } from 'react';
import { useProjectContext } from '@/providers/(main)/project';
import type { Burndown as BurndownData, StatusSummary } from '../data';
import { type ActivityGroup, SPRINT } from '../data';
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
import NoBurndown from './no-burndown';
import NoNextItems from './no-next-items';
import NoRecentActivity from './no-recent-activity';
import NoWorkStatus from './no-work-status';
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
  const { projectId } = useProjectContext();
  const { data: me } = useGetMe();
  const { data: currentSprint } = useGetCurrentSprint(projectId);
  const { data: workItemsByAssignee } = useGetWorkItemsByAssignee(me?.id, projectId);
  const { data: workItemsByProject } = useGetWorkItemsByProjectId(projectId);
  const { data: activities } = useGetAllActivities(projectId);

  const content: Record<WidgetKey, ReactNode> = {
    'next-items': body(
      'your next items',
      <NextItemsSkeleton />,
      workItemsByAssignee && workItemsByAssignee.length > 0 ? (
        <NextItems items={nextItems} />
      ) : (
        <NoNextItems />
      ),
    ),
    activity: body(
      'recent activity',
      <ActivitySkeleton />,
      activities && activities.length > 0 ? (
        <RecentActivity activity={activity} />
      ) : (
        <NoRecentActivity />
      ),
    ),
    burndown: body(
      'the burndown',
      <BurndownSkeleton />,
      currentSprint ? <Burndown burndown={burndown} /> : <NoBurndown />,
    ),
    status: body(
      'work item status',
      <WorkStatusSkeleton />,
      workItemsByProject && workItemsByProject.length > 0 ? (
        <WorkStatus status={status} />
      ) : (
        <NoWorkStatus />
      ),
    ),
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
