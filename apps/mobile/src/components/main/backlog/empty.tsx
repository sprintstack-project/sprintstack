import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';

interface EmptyBacklogProps {
  onCreate?: () => void;
  onImport?: () => void;
}

/** Under the sprints while the project has no items at all. */
export const EmptyBacklog = ({ onCreate, onImport }: EmptyBacklogProps) => (
  <View className="rounded-2xl border border-line bg-surface">
    <EmptyState
      art="bottom"
      eyebrow="Backlog"
      title="Your backlog"
      highlight="is empty"
      description="Capture everything the team might work on, rank it, then drag the top items into a sprint."
      actions={
        <>
          <Button variant="brand" size="lg" icon={Plus} fullwidth onClick={onCreate}>
            Create a work item
          </Button>
          <Button size="lg" fullwidth onClick={onImport}>
            Import from CSV
          </Button>
        </>
      }
    />
  </View>
);
