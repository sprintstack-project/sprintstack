import { useGetAllActivities } from '@sprintstack/api-client/activity';
import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import { useGetMe, useGetUserPreferences } from '@sprintstack/api-client/users';
import {
  useGetWorkItemsByAssignee,
  useGetWorkItemsByProjectId,
} from '@sprintstack/api-client/work-items';
import { type WidgetKey, widgetOrder } from '@sprintstack/shared/dashboard-widgets';
import type { ReactNode } from 'react';
import { useProjectContext } from '@/providers/main/project';
import { ACTIVITY, BURNDOWN, NEXT_ITEMS, SPRINT, STATUS_COUNTS } from '../data';
import { forProject, Loadable, placeholder, type QueryState } from '../loadable';
import {
  ActivitySkeleton,
  BurndownSkeleton,
  NextItemsSkeleton,
  WorkStatusSkeleton,
} from '../skeletons';
import Burndown from './burndown';
import NextItems from './next-items';
import NoBurndown from './no-burndown';
import NoNextItems from './no-next-items';
import NoRecentActivity from './no-recent-activity';
import NoWorkStatus from './no-work-status';
import RecentActivity from './recent-activity';
import Widget from './widget';
import WorkStatus from './work-status';

// Placeholders until the API serves these; each slots into its panel like a finished query.
const nextItems = placeholder(NEXT_ITEMS);
const activity = placeholder(ACTIVITY);
const burndown = placeholder(BURNDOWN);
const status = placeholder({ sprintName: SPRINT.name, counts: STATUS_COUNTS });

/** Holds a panel on its skeleton while the saved order is still unknown. */
const pending = <T,>(query: QueryState<T>, waiting: boolean): QueryState<T> =>
  waiting ? { data: undefined, fetching: true } : query;

const WIDGETS: Record<WidgetKey, { title: string; link?: { label: string; href: string } }> = {
  'next-items': { title: 'Your next items', link: { label: 'See all', href: '/main/backlog' } },
  activity: { title: 'Recent activity', link: { label: 'All', href: '/main/team' } },
  burndown: { title: 'Burndown' },
  status: { title: 'Work item status' },
};

/**
 * The panels in the order the person saved on the web, without the ones they removed. Until that
 * order is known the panels show their skeletons in the default order; if it can't be loaded they
 * stay in the default order rather than failing. Each panel shows its empty state until there's
 * something for it to show.
 */
const Widgets = () => {
  const projectContext = useProjectContext();
  const { projects, projectId } = projectContext;
  const { data: preferences, fetching, error } = useGetUserPreferences(projectId);
  const { data: me } = useGetMe();
  const currentSprint = forProject(useGetCurrentSprint(projectId), projectContext, null);
  const workItemsByAssignee = forProject(
    useGetWorkItemsByAssignee(me?.id, projectId),
    projectContext,
    [],
  );
  const workItemsByProject = forProject(useGetWorkItemsByProjectId(projectId), projectContext, []);
  const activities = forProject(useGetAllActivities(projectId), projectContext, []);

  const waiting = !projects || fetching;
  const widgets = error ? widgetOrder(null) : widgetOrder(preferences?.widgets);

  const content: Record<WidgetKey, ReactNode> = {
    'next-items': (
      <Loadable
        query={pending(workItemsByAssignee, waiting)}
        label="your next items"
        skeleton={<NextItemsSkeleton />}
      >
        {(assigned) =>
          assigned.length > 0 ? (
            <Loadable query={nextItems} label="your next items" skeleton={<NextItemsSkeleton />}>
              {(items) => <NextItems items={items} />}
            </Loadable>
          ) : (
            <NoNextItems />
          )
        }
      </Loadable>
    ),
    activity: (
      <Loadable
        query={pending(activities, waiting)}
        label="recent activity"
        skeleton={<ActivitySkeleton />}
      >
        {(list) =>
          list.length > 0 ? (
            <Loadable query={activity} label="recent activity" skeleton={<ActivitySkeleton />}>
              {(data) => <RecentActivity activity={data} />}
            </Loadable>
          ) : (
            <NoRecentActivity />
          )
        }
      </Loadable>
    ),
    burndown: (
      <Loadable
        query={pending(currentSprint, waiting)}
        label="the burndown"
        skeleton={<BurndownSkeleton />}
      >
        {(sprint) =>
          sprint ? (
            <Loadable query={burndown} label="the burndown" skeleton={<BurndownSkeleton />}>
              {(data) => <Burndown burndown={data} />}
            </Loadable>
          ) : (
            <NoBurndown />
          )
        }
      </Loadable>
    ),
    status: (
      <Loadable
        query={pending(workItemsByProject, waiting)}
        label="work item status"
        skeleton={<WorkStatusSkeleton />}
      >
        {(items) =>
          items.length > 0 ? (
            <Loadable query={status} label="work item status" skeleton={<WorkStatusSkeleton />}>
              {(data) => <WorkStatus status={data} />}
            </Loadable>
          ) : (
            <NoWorkStatus />
          )
        }
      </Loadable>
    ),
  };

  return widgets.map((key) => (
    <Widget key={key} title={WIDGETS[key].title} link={WIDGETS[key].link}>
      {content[key]}
    </Widget>
  ));
};

export default Widgets;
