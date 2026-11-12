'use client';
import { useGetAllSprints } from '@sprintstack/api-client/sprints';
import useSkeletonTimeout from '@sprintstack/shared/hooks/use-skeleton-timeout';
import Button from '@ui/button';
import Skeleton from '@ui/skeleton';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useProjectContext } from '@/providers/(main)/project';
import { NewWorkItem } from '../new-work-item';
import BacklogDndList from './backlog-dnd-list';
import { NO_FILTERS } from './data';
import { FilterSkeleton, SprintSkeleton } from './skeletons';
import Toolbar from './toolbar';

const Backlog = () => {
  const [creating, setCreating] = useState<{ sprint?: string | null } | null>(null);
  const [filters, setFilters] = useState(NO_FILTERS);
  const { projectId } = useProjectContext();
  const show = useSkeletonTimeout();
  const { data: sprints, fetching } = useGetAllSprints(projectId);

  if (show && fetching) {
    return (
      <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="eyebrow flex gap-2 items-center">
              <Skeleton width={40} /> items unplanned · <Skeleton width={40} /> sprints
            </div>
            <h1 className="headline text-7xl leading-none">Backlog</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" icon={PlusIcon}>
              New sprint
            </Button>
            <Button variant="brand" size="lg" icon={PlusIcon} onClick={() => setCreating({})}>
              New work item
            </Button>
          </div>
        </div>
        <FilterSkeleton />
        <SprintSkeleton />
        <SprintSkeleton />
        <SprintSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">0 items unplanned · {sprints?.length ?? 0} sprints</p>
          <h1 className="headline text-7xl leading-none">Backlog</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="lg" icon={PlusIcon}>
            New sprint
          </Button>
          <Button variant="brand" size="lg" icon={PlusIcon} onClick={() => setCreating({})}>
            New work item
          </Button>
        </div>
      </div>
      {projectId && (
        <NewWorkItem
          open={creating !== null}
          onOpenChange={(open) => !open && setCreating(null)}
          sprintId={creating?.sprint}
          projectId={projectId}
        />
      )}
      <Toolbar filters={filters} onFiltersChange={setFilters} />
      <BacklogDndList />
    </div>
  );
};

export default Backlog;
