import { Text } from '@sprintstack/ui';
import { useState } from 'react';
import { View } from 'react-native';
import {
  filterItems,
  NO_FILTERS,
  SPRINT,
  SPRINT_DAYS_LEFT,
  SPRINTS,
  type View as ViewMode,
  WORK_ITEMS,
} from './data';
import { KanbanView } from './kanban-view';
import { Toolbar } from './toolbar';
import { ListView } from './views';

export const Taskboard = () => {
  // Every sprint shows the same placeholder items until the API is wired up.
  const [sprint, setSprint] = useState(SPRINTS[0].value);
  const [view, setView] = useState<ViewMode>('list');
  const [filters, setFilters] = useState(NO_FILTERS);
  // Kept here so a card moved to another column keeps its new status in the list view too.
  const [allItems, setAllItems] = useState(WORK_ITEMS);
  const items = filterItems(allItems, filters);
  const points = items.reduce((sum, item) => sum + item.points, 0);

  return (
    <>
      <View>
        <Text className="text-sm font-bold uppercase text-ink-muted">
          {SPRINT.name} · {SPRINT_DAYS_LEFT} days left
        </Text>
        <Text
          accessibilityRole="header"
          className="text-4xl leading-14 font-extrabold uppercase text-ink"
        >
          Taskboard
        </Text>
      </View>
      <Toolbar
        sprint={sprint}
        onSprintChange={setSprint}
        view={view}
        onViewChange={setView}
        filters={filters}
        onFiltersChange={setFilters}
        matching={items.length}
      />
      <Text
        accessibilityLiveRegion="polite"
        className="-my-2 text-right text-meta font-semibold text-ink-muted"
      >
        {items.length} {items.length === 1 ? 'item' : 'items'} · {points} pts
      </Text>
      {view === 'list' ? (
        <ListView items={items} />
      ) : (
        <KanbanView items={items} onItemsChange={setAllItems} />
      )}
    </>
  );
};
