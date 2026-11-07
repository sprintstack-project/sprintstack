import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import { View } from 'react-native';
import type { Assigned } from '../data';
import { Loadable, type QueryState } from '../loadable';
import { SprintTileSkeleton, StatTileSkeleton } from '../skeletons';
import { AssignedTile, ReviewTile, SprintTile } from '../summary-tiles';

interface SummaryProps {
  sprint: QueryState<Sprint | null>;
  assigned: QueryState<Assigned>;
  awaitingReview: QueryState<number>;
}

/** Each tile loads, and fails, on its own. */
export const Summary = ({ sprint, assigned, awaitingReview }: SummaryProps) => {
  return (
    <View className="gap-4">
      <Loadable query={sprint} label="the current sprint" skeleton={<SprintTileSkeleton />}>
        {(data) => <SprintTile sprint={data} />}
      </Loadable>
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Loadable query={assigned} label="your assigned items" skeleton={<StatTileSkeleton />}>
            {(data) => <AssignedTile assigned={data} />}
          </Loadable>
        </View>
        <View className="flex-1">
          <Loadable
            query={awaitingReview}
            label="your review queue"
            skeleton={<StatTileSkeleton />}
          >
            {(data) => <ReviewTile awaitingReview={data} />}
          </Loadable>
        </View>
      </View>
    </View>
  );
};
