'use client';

import Button from '@ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { NO_FILTERS } from '../backlog/data';
import { NewWorkItem } from '../new-work-item';
import BacklogDndList from './backlog-dnd-list';
import Toolbar from './toolbar';

const Backlog = () => {
  const [creating, setCreating] = useState<{ sprint?: string | null } | null>(null);
  const [filters, setFilters] = useState(NO_FILTERS);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">0 items unplanned · 12 sprints</p>
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
      <NewWorkItem
        open={creating !== null}
        onOpenChange={(open) => !open && setCreating(null)}
        sprint={creating?.sprint}
        onCreate={(item) => {}}
      />
      <Toolbar filters={filters} onFiltersChange={setFilters} />
      <BacklogDndList />
    </div>
  );
};

export default Backlog;
