import EmptyState from '@ui/empty-state';
import { ListTodo } from 'lucide-react';

const NoWorkStatus = () => {
  return (
    <div className="mt-4 flex grow flex-col text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
      <EmptyState
        variant="widget"
        icon={ListTodo}
        title="No work items yet"
        description="Once there's work in a sprint you'll see how it splits across statuses."
      />
    </div>
  );
};

export default NoWorkStatus;
