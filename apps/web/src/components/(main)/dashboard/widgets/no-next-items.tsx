import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { Check } from 'lucide-react';

const NoNextItems = () => {
  const onCreate = () => {};
  return (
    <div className="mt-4 flex grow flex-col text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
      <EmptyState
        variant="widget"
        icon={Check}
        title="Nothing assigned"
        description="Items assigned to you show up here, soonest due first."
        actions={
          <Button variant="link" onClick={onCreate}>
            Create a work item
          </Button>
        }
      />
    </div>
  );
};

export default NoNextItems;
