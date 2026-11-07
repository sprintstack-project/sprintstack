import AddWidget from '@/components/(main)/dashboard/add-widget';
import {
  NameSkeleton,
  SprintTileSkeleton,
  StatTileSkeleton,
} from '@/components/(main)/dashboard/skeletons';
import SummaryTiles from '@/components/(main)/dashboard/summary-tiles';
import Today from '@/components/(main)/dashboard/today';
import Widgets from '@/components/(main)/dashboard/widgets';

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
    {/* <SummaryTiles
      sprint={<SprintTileSkeleton />}
      assigned={<StatTileSkeleton label="your assigned items" />}
      review={<StatTileSkeleton label="your review queue" />}
    /> */}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="grid md:col-span-2 xl:col-span-1">
        <SprintTileSkeleton />
      </div>
      <StatTileSkeleton label="your assigned items" />
      <StatTileSkeleton label="your review queue" />
    </div>
    <Widgets />
  </div>
);

export default DashboardLoading;
