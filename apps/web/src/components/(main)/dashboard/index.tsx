import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import type { UserSummary } from '@sprintstack/api-client/documents/users';
import { Suspense } from 'react';
import DashboardProvider from '@/providers/(main)/dashboard';
import AddWidget from './add-widget';
import type {
  ActivityGroup,
  Assigned,
  Burndown as BurndownData,
  StatusSummary,
  WorkItem,
} from './data';
import FirstName from './first-name';
import { NameSkeleton, SprintTileSkeleton, StatTileSkeleton } from './skeletons';
import { AssignedTile, ReviewTile, SprintTile } from './summary-tiles';
import Today from './today';
import WidgetError from './widget-error';
import Widgets from './widgets';

/** The dashboard's data, as promises the route starts without awaiting. */
interface DashboardProps {
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
  viewer,
  sprint,
  assigned,
  awaitingReview,
  nextItems,
  activity,
  burndown,
  status,
}: DashboardProps) => (
  <DashboardProvider>
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Today />
          <h1 className="headline text-7xl leading-none">
            Hello,{' '}
            <span className="text-brand-ink">
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid md:col-span-2 xl:col-span-1">
          <WidgetError label="the current sprint">
            <Suspense fallback={<SprintTileSkeleton />}>
              <SprintTile sprint={sprint} />
            </Suspense>
          </WidgetError>
        </div>
        <WidgetError label="your assigned items">
          <Suspense fallback={<StatTileSkeleton label="your assigned items" />}>
            <AssignedTile assigned={assigned} />
          </Suspense>
        </WidgetError>
        <WidgetError label="your review queue">
          <Suspense fallback={<StatTileSkeleton label="your review queue" />}>
            <ReviewTile awaitingReview={awaitingReview} />
          </Suspense>
        </WidgetError>
      </div>
      <Widgets nextItems={nextItems} activity={activity} burndown={burndown} status={status} />
      {/* content={{
          'next-items': (
            <Section label="your next items" fallback={<NextItemsSkeleton />}>
              <NextItems items={nextItems} />
            </Section>
          ),
          activity: (
            <Section label="recent activity" fallback={<ActivitySkeleton />}>
              <RecentActivity activity={activity} />
            </Section>
          ),
          burndown: (
            <Section label="the burndown" fallback={<BurndownSkeleton />}>
              <Burndown burndown={burndown} />
            </Section>
          ),
          status: (
            <Section label="work item status" fallback={<WorkStatusSkeleton />}>
              <WorkStatus status={status} />
            </Section>
          ),
        }}
      /> */}
    </div>
  </DashboardProvider>
);

export default Dashboard;
