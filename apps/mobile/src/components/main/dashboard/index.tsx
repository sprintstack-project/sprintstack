import { useGetCurrentSprint } from '@sprintstack/api-client/sprints';
import { useGetMe } from '@sprintstack/api-client/users';
import {
  useGetWorkItemsByAssignee,
  useGetWorkItemsByProjectId,
} from '@sprintstack/api-client/work-items';
import DashboardProvider from '@sprintstack/shared/providers/main/dashboard';
import Text from '@ui/text';
import { View } from 'react-native';
import { useProjectContext } from '@/providers/main/project';
import { AWAITING_REVIEW } from './data';
import FirstName from './first-name';
import { forProject, placeholder } from './loadable';
import Summary from './summary';
import Today from './today';
import Widgets from './widgets';

// Placeholder until the API serves it; it slots into its tile like a finished query.
const awaitingReview = placeholder(AWAITING_REVIEW);

const Dashboard = () => {
  const projectContext = useProjectContext();
  const { projectId } = projectContext;
  const { data: me } = useGetMe();
  const sprint = useGetCurrentSprint(projectId);
  const allWorkItems = forProject(useGetWorkItemsByProjectId(projectId), projectContext, []);
  const userWorkItems = forProject(
    useGetWorkItemsByAssignee(me?.id, projectId),
    projectContext,
    [],
  );

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
      <Summary
        sprint={sprint}
        awaitingReview={awaitingReview}
        allWorkItems={allWorkItems}
        userWorkItems={userWorkItems}
      />
      <Widgets />
    </DashboardProvider>
  );
};

export default Dashboard;
