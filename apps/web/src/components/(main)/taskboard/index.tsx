'use client';

import { Button } from '@ui/button';
import { format } from 'date-fns';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { NewWorkItem } from '../new-work-item';
import { toPlannedItem } from '../new-work-item/data';
import {
  filterItems,
  NO_FILTERS,
  SPRINT,
  SPRINT_DAYS_LEFT,
  SPRINTS,
  type View,
  WORK_ITEMS,
} from './data';
import KanbanView from './kanban-view';
import ListView from './list-view';
import Toolbar from './toolbar';

const Taskboard = () => {
  // Every sprint shows the same placeholder items until the API is wired up.
  const [sprint, setSprint] = useState(SPRINTS[0].value);
  const [view, setView] = useState<View>('list');
  const [filters, setFilters] = useState(NO_FILTERS);
  // Kept here so a card dragged to another column keeps its new status in the list view too.
  const [allItems, setAllItems] = useState(WORK_ITEMS);
  const [creating, setCreating] = useState(false);
  const items = filterItems(allItems, filters);
  const points = items.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            {SPRINT.name} · {format(SPRINT.start, 'd MMM')} – {format(SPRINT.end, 'd MMM')} ·{' '}
            {SPRINT_DAYS_LEFT} days left
          </p>
          <h1 className="headline text-7xl leading-none">Taskboard</h1>
        </div>
        <Button variant="brand" size="lg" icon={PlusIcon} onClick={() => setCreating(true)}>
          New work item
        </Button>
      </div>
      <NewWorkItem
        open={creating}
        onOpenChange={setCreating}
        onCreate={(item) =>
          setAllItems((all) => [
            toPlannedItem(
              item,
              all.map((i) => i.key),
            ),
            ...all,
          ])
        }
      />
      <Toolbar
        sprint={sprint}
        onSprintChange={setSprint}
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        matching={items.length}
      />
      <p aria-live="polite" className="-mt-2 text-right text-meta text-ink-muted tabular-nums">
        {items.length} {items.length === 1 ? 'item' : 'items'} · {points} pts
      </p>
      {view === 'list' ? (
        <ListView items={items} />
      ) : (
        <KanbanView items={items} onItemsChange={setAllItems} />
      )}
    </div>
  );
};

export default Taskboard;
