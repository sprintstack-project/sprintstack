import Dashboard from '@/components/(main)/dashboard';
import {
  ACTIVITY,
  ASSIGNED,
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

/**
 * Starts every query without awaiting it, so the dashboard streams each one in as it lands. Only
 * the selected project is awaited: the widget order and the sprint both need its id.
 */
const DashboardPage = async () => {
  const viewer = getViewer();
  const project = await getSelectedProject();
  return (
    <Dashboard
      projectId={project?.id}
      viewer={viewer}
      sprint={project ? getCurrentSprint(project.id) : Promise.resolve(null)}
      // Placeholders until the API serves these. use() on a plain promise still suspends once, so
      // these stream in like the real queries will.
      assigned={Promise.resolve(ASSIGNED)}
      awaitingReview={Promise.resolve(AWAITING_REVIEW)}
      nextItems={Promise.resolve(NEXT_ITEMS)}
      activity={Promise.resolve(ACTIVITY)}
      burndown={Promise.resolve({ sprint: SPRINT, points: BURNDOWN, ticks: BURNDOWN_TICKS })}
      status={Promise.resolve({ sprintName: SPRINT.name, counts: STATUS_COUNTS })}
    />
  );
};

export default DashboardPage;
