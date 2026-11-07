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
import Section from './section';
import {
  ActivitySkeleton,
  BurndownSkeleton,
  NameSkeleton,
  NextItemsSkeleton,
  SprintTileSkeleton,
  StatTileSkeleton,
  WorkStatusSkeleton,
} from './skeletons';
import SummaryTiles, { AssignedTile, ReviewTile, SprintTile } from './summary-tiles';
import Today from './today';
import Widgets from './widgets';
import Burndown from './widgets/burndown';
import NextItems from './widgets/next-items';
import RecentActivity from './widgets/recent-activity';
import WorkStatus from './widgets/work-status';

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
      <SummaryTiles
        sprint={
          <Section label="the current sprint" fallback={<SprintTileSkeleton />}>
            <SprintTile sprint={sprint} />
          </Section>
        }
        assigned={
          <Section
            label="your assigned items"
            fallback={<StatTileSkeleton label="your assigned items" />}
          >
            <AssignedTile assigned={assigned} />
          </Section>
        }
        review={
          <Section
            label="your review queue"
            fallback={<StatTileSkeleton label="your review queue" />}
          >
            <ReviewTile awaitingReview={awaitingReview} />
          </Section>
        }
      />
      <Widgets
        content={{
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
      />
    </div>
  </DashboardProvider>
);

export default Dashboard;
