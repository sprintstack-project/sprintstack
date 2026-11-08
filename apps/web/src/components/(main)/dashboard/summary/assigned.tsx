import Card from '@ui/card';
import { Suspense, use } from 'react';
import type { Assigned } from '../data';
import ErrorWrapper from '../error-wrapper';
import { StatTileSkeleton } from '../skeletons';

const AssignedTile = ({ assigned: assignedPromise }: { assigned: Promise<Assigned> }) => {
  const assigned = use(assignedPromise);
  return (
    <ErrorWrapper label="your assigned items">
      <Suspense fallback={<StatTileSkeleton label="your assigned items" />}>
        <Card variant="muted">
          <span className="eyebrow text-current">Assigned to you</span>
          <span className="flex-1" />
          <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{assigned.total}</p>
          <p className="text-body-strong font-stretch-semi-condensed">
            <span className="text-danger">{assigned.dueToday} due today</span> ·{' '}
            {assigned.dueThisWeek} this week
          </p>
        </Card>
      </Suspense>
    </ErrorWrapper>
  );
};

export default AssignedTile;
