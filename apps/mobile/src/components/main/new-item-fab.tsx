import type { NewWorkItem as Created } from '@sprintstack/shared';
import { Button } from '@sprintstack/ui';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { NewWorkItem } from './new-work-item';

/**
 * The floating "New item" button on screens that list work items; pass it as MainScreen's `fab`.
 * With `onCreate` it opens the new work item form and hands over what's created.
 */
export const NewItemFab = ({
  label = 'New item',
  onCreate,
}: {
  label?: string;
  onCreate?: (item: Created) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="brand" size="lg" icon={Plus} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {onCreate && <NewWorkItem open={open} onClose={() => setOpen(false)} onCreate={onCreate} />}
    </>
  );
};
