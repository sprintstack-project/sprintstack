import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import { clsx } from 'clsx';
import { use } from 'react';
import AssignedTile from './assigned';
import ImportTile from './import';
import ReviewTile from './review';
import SetupTile from './setup';
import SprintTile from './sprint';

interface SummaryProps {
  sprint: Promise<Sprint | null>;
  awaitingReview: Promise<number>;
  userWorkItems: Promise<WorkItem[]>;
  allWorkItems: Promise<WorkItem[]>;
}

const Summary = ({
  sprint,
  awaitingReview,
  userWorkItems,
  allWorkItems: allWorkItemsPromise,
}: SummaryProps) => {
  const allWorkItems = use(allWorkItemsPromise);
  return (
    <div
      className={clsx('grid gap-4 md:grid-cols-2 ', {
        'xl:grid-cols-[1.4fr_1fr_1fr]': allWorkItems?.length > 0,
        'xl:grid-cols-[1.4fr_1fr]': allWorkItems?.length === 0,
      })}
    >
      <div className="grid md:col-span-2 xl:col-span-1">
        {allWorkItems?.length > 0 ? <SprintTile sprint={sprint} /> : <SetupTile />}
      </div>
      {allWorkItems?.length > 0 ? <AssignedTile userWorkItems={userWorkItems} /> : <ImportTile />}
      {allWorkItems?.length > 0 && <ReviewTile awaitingReview={awaitingReview} />}
    </div>
  );
};

export default Summary;
