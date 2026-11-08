import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import type { UserSummary } from '@sprintstack/api-client/documents/users';
import DashboardProvider from '@sprintstack/shared/providers/main/dashboard';
import { Suspense } from 'react';
import type {
  ActivityGroup,
  Assigned,
  Burndown as BurndownData,
  StatusSummary,
  WorkItem,
} from './data';
import FirstName from './first-name';
import { NameSkeleton } from './skeletons';
import Summary from './summary';
import Today from './today';
import Widgets from './widgets';
import AddWidget from './widgets/add-widget';

/** The dashboard's data, as promises the route starts without awaiting. */
interface DashboardProps {
  /** The selected project, whose saved widget order the dashboard follows. */
  projectId: string | undefined;
  viewer: Promise<UserSummary>;
  sprint: Promise<Sprint | null>;
  assigned: Promise<Assigned>;
  awaitingReview: Promise<number>;
  nextItems: Promise<WorkItem[]>;
  activity: Promise<ActivityGroup[]>;
  burndown: Promise<BurndownData>;
  status: Promise<StatusSummary>;
}

/**
 * The layout renders straight away; each section shows its skeleton until its own promise
 * resolves, and an error in its place if it fails.
 */
const Dashboard = ({
  projectId,
  viewer,
  sprint,
  assigned,
  awaitingReview,
  nextItems,
  activity,
  burndown,
  status,
}: DashboardProps) => (
  <DashboardProvider projectId={projectId}>
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Today />
          <h1 className="headline text-7xl leading-none">
            Hello,
            <span className="text-brand-ink ml-4">
              {
                <Suspense fallback={<NameSkeleton />}>
                  <FirstName viewer={viewer} />
                </Suspense>
              }
              .
            </span>
          </h1>
        </div>
        <AddWidget />
      </div>
      <Summary
        projectId={projectId}
        sprint={sprint}
        assigned={assigned}
        awaitingReview={awaitingReview}
      />
      <Widgets nextItems={nextItems} activity={activity} burndown={burndown} status={status} />
    </div>
  </DashboardProvider>
);

export default Dashboard;
