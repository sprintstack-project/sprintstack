import Dashboard from '@/components/(main)/dashboard';
import {
  ACTIVITY,
  AWAITING_REVIEW,
  BURNDOWN,
  BURNDOWN_TICKS,
  NEXT_ITEMS,
  SPRINT,
  STATUS_COUNTS,
} from '@/components/(main)/dashboard/data';
import { getSelectedProject } from '@/server/queries/projects';
import { getCurrentSprint } from '@/server/queries/sprints';
import { getViewer } from '@/server/queries/users';
import { getWorkItemsByAssignee, getWorkItemsByProjectId } from '@/server/queries/work-items';

/**
 * Starts every query without awaiting it, so the dashboard streams each one in as it lands. Only
 * the selected project is awaited: the widget order and the sprint both need its id.
 */
const DashboardPage = async () => {
  const project = await getSelectedProject();
  const viewer = getViewer();

  const allWorkItems = project
    ? viewer.then(({ id }) => getWorkItemsByProjectId(project.id, id))
    : Promise.resolve([]);

  const userWorkItems = project
    ? viewer.then(({ id }) => getWorkItemsByAssignee(project.id, id))
    : Promise.resolve([]);
  return (
    <Dashboard
      projectId={project?.id}
      viewer={viewer}
      allWorkItems={allWorkItems}
      userWorkItems={userWorkItems}
      sprint={project ? getCurrentSprint(project.id) : Promise.resolve(null)}
      // Placeholders until the API serves these. use() on a plain promise still suspends once, so
      // these stream in like the real queries will.
      awaitingReview={Promise.resolve(AWAITING_REVIEW)}
      nextItems={Promise.resolve(NEXT_ITEMS)}
      activity={Promise.resolve(ACTIVITY)}
      burndown={Promise.resolve({ sprint: SPRINT, points: BURNDOWN, ticks: BURNDOWN_TICKS })}
      status={Promise.resolve({ sprintName: SPRINT.name, counts: STATUS_COUNTS })}
    />
  );
};

export default DashboardPage;
