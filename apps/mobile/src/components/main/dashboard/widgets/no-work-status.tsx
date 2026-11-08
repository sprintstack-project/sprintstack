import EmptyState from '@ui/empty-state';
import { ListTodo } from 'lucide-react-native';
import Widget from './widget';

const NoWorkStatus = () => (
  <Widget title="Work Status">
    <EmptyState
      variant="widget"
      icon={ListTodo}
      title="No work items yet"
      description="Their split across statuses shows up here."
    />
  </Widget>
);

export default NoWorkStatus;
