import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { type Href, router } from 'expo-router';
import { ChartNoAxesGantt } from 'lucide-react-native';
import Widget from './widget';

const NoBurndown = () => (
  <Widget title="Burndown">
    <EmptyState
      variant="widget"
      icon={ChartNoAxesGantt}
      title="No active sprint"
      description="Start one to see the burndown."
      actions={
        <Button variant="link" onClick={() => router.navigate('/main/backlog' as Href)}>
          Plan a sprint
        </Button>
      }
    />
  </Widget>
);

export default NoBurndown;
