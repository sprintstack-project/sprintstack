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
import { getCurrentSprint } from '@/server/queries/sprints';
import { getViewer } from '@/server/queries/users';

// TODO: the sidebar's selected project only lives in client state, so the server can't see it.
// Keep it in a cookie (or the URL) and read it here.
const PROJECT_ID = '01a19e27-1ce3-7763-9392-f6a797c12ef6';

/** Starts every query at once, without awaiting; the dashboard streams each one in as it lands. */
const DashboardPage = () => (
  <Dashboard
    viewer={getViewer()}
    sprint={getCurrentSprint(PROJECT_ID)}
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

export default DashboardPage;
