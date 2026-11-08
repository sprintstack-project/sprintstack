import { useGetWorkItemsByProjectId } from '@sprintstack/api-client/work-items';
import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import Eyebrow from '@ui/eyebrow';
import Text from '@ui/text';
import { router } from 'expo-router';
import { Plus, SquareStack } from 'lucide-react-native';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { View } from 'react-native';
import { useProjectContext } from '@/providers/main/project';
import {
  filterItems,
  NO_FILTERS,
  SPRINT,
  SPRINT_DAYS_LEFT,
  SPRINTS,
  type View as ViewMode,
  type WorkItem,
} from './data';
import { KanbanView } from './kanban-view';
import { Toolbar } from './toolbar';
import { ListView } from './views';

interface TaskboardProps {
  /** Held by the page, so items made with its "New item" button join the board. */
  items: WorkItem[];
  onItemsChange: Dispatch<SetStateAction<WorkItem[]>>;
}

export const Taskboard = ({ items: allItems, onItemsChange: setAllItems }: TaskboardProps) => {
  // Every sprint shows the same placeholder items until the API is wired up.
  const [sprint, setSprint] = useState(SPRINTS[0].value);
  const [view, setView] = useState<ViewMode>('list');
  const [filters, setFilters] = useState(NO_FILTERS);
  const items = filterItems(allItems, filters);
  const points = items.reduce((sum, item) => sum + item.points, 0);
  const { projectId } = useProjectContext();
  const { data: workItems } = useGetWorkItemsByProjectId(projectId);

  const onCreate = () => {};

  if (!workItems || workItems.length === 0) {
    return (
      <>
        <View className="flex flex-col gap-1">
          <Eyebrow>No active sprint</Eyebrow>
          <Text className="text-4xl leading-14 font-extrabold uppercase text-ink">Taskboard</Text>
        </View>
        <View className="rounded-2xl border border-line bg-surface">
          <EmptyState
            eyebrow="Taskboard"
            title="No sprint"
            highlight="is running"
            description="The board shows work in the active sprint. Plan one from the backlog, then start it."
            actions={
              <>
                <Button
                  variant="brand"
                  size="lg"
                  icon={SquareStack}
                  fullwidth
                  onClick={() => router.navigate('/main/backlog')}
                >
                  Plan a sprint
                </Button>
                <Button size="lg" icon={Plus} fullwidth onClick={onCreate}>
                  Create a work item
                </Button>
              </>
            }
          />
        </View>
      </>
    );
  }

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
