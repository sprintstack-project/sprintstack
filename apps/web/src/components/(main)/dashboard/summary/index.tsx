import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import { Suspense } from 'react';
import type { Assigned } from '../data';
import ErrorWrapper from '../error-wrapper';
import { SprintTileSkeleton, StatTileSkeleton } from '../skeletons';
import { AssignedTile, ReviewTile, SprintTile } from '../summary-tiles';

interface SummaryProps {
  sprint: Promise<Sprint | null>;
  assigned: Promise<Assigned>;
  awaitingReview: Promise<number>;
}

const Summary = ({ sprint, assigned, awaitingReview }: SummaryProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="grid md:col-span-2 xl:col-span-1">
        <ErrorWrapper label="the current sprint">
          <Suspense fallback={<SprintTileSkeleton />}>
            <SprintTile sprint={sprint} />
          </Suspense>
        </ErrorWrapper>
      </div>
      <ErrorWrapper label="your assigned items">
        <Suspense fallback={<StatTileSkeleton label="your assigned items" />}>
          <AssignedTile assigned={assigned} />
        </Suspense>
      </ErrorWrapper>
      <ErrorWrapper label="your review queue">
        <Suspense fallback={<StatTileSkeleton label="your review queue" />}>
          <ReviewTile awaitingReview={awaitingReview} />
        </Suspense>
      </ErrorWrapper>
    </div>
  );
};

export default Summary;
