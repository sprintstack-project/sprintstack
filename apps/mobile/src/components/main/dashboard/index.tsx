import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import { useProjectContext } from '@sprintstack/shared/providers/project';
import Text from '@ui/text';
import { View } from 'react-native';
import { ASSIGNED, AWAITING_REVIEW } from './data';
import { FirstName } from './first-name';
import { placeholder, type QueryState } from './loadable';
import { Summary } from './summary';
import { Today } from './today';
import { Widgets } from './widgets';

// Placeholders until the API serves these; each slots into its section like a finished query.
const assigned = placeholder(ASSIGNED);
const awaitingReview = placeholder(AWAITING_REVIEW);

/** The selected project's current sprint; null once it's clear there's no project to have one. */
const useCurrentSprint = (): QueryState<Sprint | null> => {
  const { projects, projectId } = useProjectContext();
  const { data, fetching, error, refetch } = useGetCurrentSprint(projectId);
  if (projects && !projectId) return placeholder(null);
  return { data, fetching, error, refetch: () => refetch({ requestPolicy: 'network-only' }) };
};

/**
 * The greeting renders straight away; each tile and panel body shows its skeleton until its own
 * query lands, and an error with Retry in its place if it fails. The panels follow the saved order.
 */
export const Dashboard = () => {
  const sprint = useCurrentSprint();
  return (
    <>
      <View>
        <Today />
        <View className="flex-row items-center gap-2">
          <Text
            accessibilityRole="header"
            className="text-4xl leading-14 font-extrabold uppercase text-ink"
          >
            Hello,
          </Text>
          <Text className="text-4xl leading-14 font-extrabold uppercase text-brand-ink">
            <FirstName />.
          </Text>
        </View>
      </View>
      <Summary sprint={sprint} assigned={assigned} awaitingReview={awaitingReview} />
      <Widgets />
    </>
  );
};
