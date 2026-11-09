import EmptyState from '@ui/empty-state';
import { ChartNoAxesGantt } from 'lucide-react';
import Link from 'next/link';

const NoBurndown = () => {
  return (
    <div className="mt-4 flex grow flex-col text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
      <EmptyState
        variant="widget"
        icon={ChartNoAxesGantt}
        title="No active sprint"
        description="Start a sprint to track remaining points day by day."
        actions={
          <Link href="/backlog" className="link kbd-focus rounded-xs text-[1rem] leading-5">
            Plan a sprint
          </Link>
        }
      />
    </div>
  );
};

export default NoBurndown;
