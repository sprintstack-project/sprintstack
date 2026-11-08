import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import type { Assigned } from '../data';
import AssignedTile from './assigned';
import ImportTile from './import';
import ReviewTile from './review';
import SetupTile from './setup';
import SprintTile from './sprint';

interface SummaryProps {
  projectId: string | undefined;
  sprint: Promise<Sprint | null>;
  assigned: Promise<Assigned>;
  awaitingReview: Promise<number>;
}

const Summary = ({ projectId, sprint, assigned, awaitingReview }: SummaryProps) => {
  if (!projectId) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr]">
        <div className="grid md:col-span-2 xl:col-span-1">
          <SetupTile />
        </div>
        <ImportTile />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="grid md:col-span-2 xl:col-span-1">
        <SprintTile sprint={sprint} />
      </div>
      <AssignedTile assigned={assigned} />
      <ReviewTile awaitingReview={awaitingReview} />
    </div>
  );
};

export default Summary;
