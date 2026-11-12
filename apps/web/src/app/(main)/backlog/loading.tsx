import Skeleton from '@ui/skeleton';
import { FilterSkeleton, SprintSkeleton } from '@/components/(main)/backlog/skeletons';

const BacklogLoading = () => {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="eyebrow flex gap-2 items-center">
            <Skeleton width={40} /> items unplanned · <Skeleton width={40} /> sprints
          </div>
          <h1 className="headline text-7xl leading-none">Backlog</h1>
        </div>
      </div>
      <FilterSkeleton />
      <SprintSkeleton />
      <SprintSkeleton />
      <SprintSkeleton />
    </div>
  );
};

export default BacklogLoading;
