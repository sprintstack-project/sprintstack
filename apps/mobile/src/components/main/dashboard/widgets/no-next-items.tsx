import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { Check } from 'lucide-react-native';

const NoNextItems = () => {
  const onCreate = () => {};
  return (
    <EmptyState
      variant="widget"
      icon={Check}
      title="Nothing assigned"
      description="Your next items show up here."
      actions={
        <Button variant="link" onClick={onCreate}>
          Create a work item
        </Button>
      }
    />
  );
};

export default NoNextItems;
