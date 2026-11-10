import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { type Href, router } from 'expo-router';
import { Clock } from 'lucide-react-native';

const NoRecentActivity = () => (
  <EmptyState
    variant="widget"
    icon={Clock}
    title="All quiet"
    description="Team activity appears here."
    actions={
      <Button variant="link" onClick={() => router.navigate('/main/team' as Href)}>
        Invite your team
      </Button>
    }
  />
);

export default NoRecentActivity;
