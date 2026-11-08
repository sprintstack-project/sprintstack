import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import DashboardProvider from '@sprintstack/shared/providers/main/dashboard';
import Text from '@ui/text';
import { View } from 'react-native';
import { useProjectContext } from '@/providers/main/project';
import { ASSIGNED, AWAITING_REVIEW } from './data';
import FirstName from './first-name';
import { placeholder } from './loadable';
import Summary from './summary';
import Today from './today';
import Widgets from './widgets';

// Placeholders until the API serves these; each slots into its section like a finished query.
const assigned = placeholder(ASSIGNED);
const awaitingReview = placeholder(AWAITING_REVIEW);

const Dashboard = () => {
  const { projectId } = useProjectContext();
  const sprint = useGetCurrentSprint(projectId);

  return (
    <DashboardProvider projectId={projectId}>
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
    </DashboardProvider>
  );
};

export default Dashboard;
