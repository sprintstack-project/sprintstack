import { Button } from '@sprintstack/ui';
import { Plus } from 'lucide-react-native';

/** The floating "New item" button on screens that list work items; pass it as MainScreen's `fab`. */
export const NewItemFab = ({ label = 'New item' }: { label?: string }) => (
  <Button variant="brand" size="lg" icon={Plus}>
    {label}
  </Button>
);
