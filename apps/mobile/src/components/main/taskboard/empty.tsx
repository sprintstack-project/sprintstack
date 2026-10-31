import { Button, EmptyState } from '@sprintstack/ui';
import { router } from 'expo-router';
import { Plus, SquareStack } from 'lucide-react-native';
import { View } from 'react-native';

/** In place of the list or board while no sprint is running. */
export const NoSprint = ({ onCreate }: { onCreate?: () => void }) => (
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
            block
            onClick={() => router.navigate('/main/backlog')}
          >
            Plan a sprint
          </Button>
          <Button size="lg" icon={Plus} block onClick={onCreate}>
            Create a work item
          </Button>
        </>
      }
    />
  </View>
);

interface NoMatchesProps {
  /** Says what the filters ask for, and which one to drop to see something, e.g. "No bugs in review…". */
  description: string;
  /** e.g. "0 of 9 items". */
  eyebrow: string;
  onClearAll: () => void;
  /** The one filter whose removal brings items back, e.g. `{ label: 'In review', … }`. */
  suggestion?: { label: string; onRemove: () => void };
}

/** In place of the list or board when the sprint has items but the filters leave none. */
export const NoMatches = ({ description, eyebrow, onClearAll, suggestion }: NoMatchesProps) => (
  <View className="rounded-2xl border border-line bg-surface">
    <EmptyState
      art="top"
      eyebrow={eyebrow}
      title="Nothing matches"
      description={description}
      actions={
        <>
          <Button variant="primary" size="lg" block onClick={onClearAll}>
            Clear all filters
          </Button>
          {suggestion && (
            <Button size="lg" block onClick={suggestion.onRemove}>
              Remove “{suggestion.label}”
            </Button>
          )}
        </>
      }
    />
  </View>
);
