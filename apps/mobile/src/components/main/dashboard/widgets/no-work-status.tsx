import EmptyState from '@ui/empty-state';
import { ListTodo } from 'lucide-react-native';

const NoWorkStatus = () => (
  <EmptyState
    variant="widget"
    icon={ListTodo}
    title="No work items yet"
    description="Their split across statuses shows up here."
  />
);

export default NoWorkStatus;
