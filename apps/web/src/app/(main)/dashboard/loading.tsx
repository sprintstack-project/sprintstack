import {
  ActivitySkeleton,
  BurndownSkeleton,
  NameSkeleton,
  NextItemsSkeleton,
  SprintTileSkeleton,
  StatTileSkeleton,
  WidgetFrameSkeleton,
  WorkStatusSkeleton,
} from '@/components/(main)/dashboard/skeletons';
import Today from '@/components/(main)/dashboard/today';
import AddWidget from '@/components/(main)/dashboard/widgets/add-widget';

/** Shows while navigating here, before the page arrives. */
const DashboardLoading = () => (
  <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Today />
        <h1 className="headline text-7xl leading-none">
          Hello,{' '}
          <span className="text-brand-ink">
            <NameSkeleton />.
          </span>
        </h1>
      </div>
      <AddWidget />
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="grid md:col-span-2 xl:col-span-1">
        <SprintTileSkeleton />
      </div>
      <StatTileSkeleton label="your assigned items" />
      <StatTileSkeleton label="your review queue" />
    </div>
    {/* The person's own widget order isn't known yet, so this is the default one. */}
    <div className="grid gap-4 xl:grid-cols-2">
      <WidgetFrameSkeleton title="Your next items">
        <NextItemsSkeleton />
      </WidgetFrameSkeleton>
      <WidgetFrameSkeleton title="Recent activity">
        <ActivitySkeleton />
      </WidgetFrameSkeleton>
      <WidgetFrameSkeleton title="Burndown">
        <BurndownSkeleton />
      </WidgetFrameSkeleton>
      <WidgetFrameSkeleton title="Work item status">
        <WorkStatusSkeleton />
      </WidgetFrameSkeleton>
    </div>
  </div>
);

export default DashboardLoading;
