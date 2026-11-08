import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import { View } from 'react-native';
import { useProjectContext } from '@/providers/main/project';
import type { Assigned } from '../data';
import type { QueryState } from '../loadable';
import AssignedTile from './assigned';
import ImportTile from './import';
import ReviewTile from './review';
import SetupTile from './setup';
import SprintTile from './sprint';

interface SummaryProps {
  sprint: QueryState<Sprint | null>;
  assigned: QueryState<Assigned>;
  awaitingReview: QueryState<number>;
}

/** Each tile loads, and fails, on its own. */
const Summary = ({ sprint, assigned, awaitingReview }: SummaryProps) => {
  const { projects, projectId } = useProjectContext();

  if (projects && !projectId) {
    return (
      <View className="gap-4">
        <SetupTile />
        <ImportTile />
      </View>
    );
  }

  return (
    <View className="gap-4">
      <SprintTile sprint={sprint} />
      <View className="flex-row gap-4">
        <View className="flex-1">
          <AssignedTile assigned={assigned} />
        </View>
        <View className="flex-1">
          <ReviewTile awaitingReview={awaitingReview} />
        </View>
      </View>
    </View>
  );
};

export default Summary;
