import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import { View } from 'react-native';
import { Loadable, type QueryState } from '../loadable';
import { SprintTileSkeleton, StatTileSkeleton } from '../skeletons';
import AssignedTile from './assigned';
import ImportTile from './import';
import ReviewTile from './review';
import SetupTile from './setup';
import SprintTile from './sprint';

interface SummaryProps {
  sprint: QueryState<Sprint | null>;
  awaitingReview: QueryState<number>;
  allWorkItems: QueryState<WorkItem[]>;
  userWorkItems: QueryState<WorkItem[]>;
}

const SummarySkeleton = () => (
  <View className="gap-4">
    <SprintTileSkeleton />
    <View className="flex-row gap-4">
      <View className="flex-1">
        <StatTileSkeleton />
      </View>
      <View className="flex-1">
        <StatTileSkeleton />
      </View>
    </View>
  </View>
);

/**
 * The setup checklist until the project has work items, then the sprint and the viewer's queues.
 * Each tile loads, and fails, on its own.
 */
const Summary = ({ sprint, awaitingReview, allWorkItems, userWorkItems }: SummaryProps) => (
  <Loadable query={allWorkItems} label="your project" skeleton={<SummarySkeleton />}>
    {(items) =>
      items.length > 0 ? (
        <View className="gap-4">
          <SprintTile sprint={sprint} />
          <View className="flex-row gap-4">
            <View className="flex-1">
              <AssignedTile userWorkItems={userWorkItems} />
            </View>
            <View className="flex-1">
              <ReviewTile awaitingReview={awaitingReview} />
            </View>
          </View>
        </View>
      ) : (
        <View className="gap-4">
          <SetupTile />
          <ImportTile />
        </View>
      )
    }
  </Loadable>
);

export default Summary;
