import { useGetUserPreferences } from '@sprintstack/api-client/users';
import { type WidgetKey, widgetOrder } from '@sprintstack/shared/dashboard-widgets';
import { useProjectContext } from '@sprintstack/shared/providers/project';
import type { ReactNode } from 'react';
import { ACTIVITY, BURNDOWN, NEXT_ITEMS, SPRINT, STATUS_COUNTS } from '../data';
import { Loadable, placeholder, type QueryState } from '../loadable';
import {
  ActivitySkeleton,
  BurndownSkeleton,
  NextItemsSkeleton,
  WorkStatusSkeleton,
} from '../skeletons';
import { Burndown } from './burndown';
import { NextItems } from './next-items';
import { RecentActivity } from './recent-activity';
import { Widget } from './widget';
import { WorkStatus } from './work-status';

// Placeholders until the API serves these; each slots into its panel like a finished query.
const nextItems = placeholder(NEXT_ITEMS);
const activity = placeholder(ACTIVITY);
const burndown = placeholder(BURNDOWN);
const status = placeholder({ sprintName: SPRINT.name, counts: STATUS_COUNTS });

/** Holds a panel on its skeleton while the saved order is still unknown. */
const pending = <T,>(query: QueryState<T>, waiting: boolean): QueryState<T> =>
  waiting ? { data: undefined, fetching: true } : query;

const WIDGETS: Record<
  WidgetKey,
  { title: string; link?: { label: string; href: string }; body: (waiting: boolean) => ReactNode }
> = {
  'next-items': {
    title: 'Your next items',
    link: { label: 'See all', href: '/main/backlog' },
    body: (waiting) => (
      <Loadable
        query={pending(nextItems, waiting)}
        label="your next items"
        skeleton={<NextItemsSkeleton />}
      >
        {(items) => <NextItems items={items} />}
      </Loadable>
    ),
  },
  activity: {
    title: 'Recent activity',
    link: { label: 'All', href: '/main/team' },
    body: (waiting) => (
      <Loadable
        query={pending(activity, waiting)}
        label="recent activity"
        skeleton={<ActivitySkeleton />}
      >
        {(data) => <RecentActivity activity={data} />}
      </Loadable>
    ),
  },
  burndown: {
    title: 'Burndown',
    body: (waiting) => (
      <Loadable
        query={pending(burndown, waiting)}
        label="the burndown"
        skeleton={<BurndownSkeleton />}
      >
        {(data) => <Burndown burndown={data} />}
      </Loadable>
    ),
  },
  status: {
    title: 'Work item status',
    body: (waiting) => (
      <Loadable
        query={pending(status, waiting)}
        label="work item status"
        skeleton={<WorkStatusSkeleton />}
      >
        {(data) => <WorkStatus status={data} />}
      </Loadable>
    ),
  },
};

/**
 * The panels in the order the person saved on the web, without the ones they removed. Until that
 * order is known the panels show their skeletons in the default order; if it can't be loaded they
 * stay in the default order rather than failing.
 */
export const Widgets = () => {
  const { projects, projectId } = useProjectContext();
  const { data: preferences, fetching, error } = useGetUserPreferences(projectId);
  const waiting = !projects || fetching;
  const widgets = error ? widgetOrder(null) : widgetOrder(preferences?.widgets);

  return widgets.map((key) => (
    <Widget key={key} title={WIDGETS[key].title} link={WIDGETS[key].link}>
      {WIDGETS[key].body(waiting)}
    </Widget>
  ));
};
