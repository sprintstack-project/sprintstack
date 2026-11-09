import EmptyState from '@ui/empty-state';
import { Clock } from 'lucide-react';
import Link from 'next/link';

const NoRecentActivity = () => {
  return (
    <div className="mt-4 flex grow flex-col text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
      <EmptyState
        variant="widget"
        icon={Clock}
        title="All quiet"
        description="Changes, comments and status moves from your team appear here as they happen."
        actions={
          <Link href="/team" className="link kbd-focus rounded-xs text-[1rem] leading-5">
            Invite your team
          </Link>
        }
      />
    </div>
  );
};

export default NoRecentActivity;
