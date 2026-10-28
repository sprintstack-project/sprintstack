import { Text } from '@sprintstack/ui';
import { format } from 'date-fns';
import { View } from 'react-native';
import { Burndown } from './burndown';
import { TODAY, USER } from './data';
import { NextItems } from './next-items';
import { Panel } from './panel';
import { RecentActivity } from './recent-activity';
import { SummaryTiles } from './summary-tiles';
import { WorkStatus } from './work-status';

export const Dashboard = () => {
  return (
    <>
      <View className="gap-2">
        <Text className="text-eyebrow font-bold uppercase text-ink-muted">
          {format(TODAY, 'eeee, d MMMM')}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text
            accessibilityRole="header"
            className="text-3xl leading-14 font-extrabold uppercase text-ink"
          >
            Hello,
          </Text>
          <Text className="text-3xl leading-14 font-extrabold uppercase text-brand-ink">
            {USER.firstName}.
          </Text>
        </View>
      </View>
      <SummaryTiles />
      <Panel title="Your next items" link={{ label: 'See all', href: '/main/backlog' }}>
        <NextItems />
      </Panel>
      <Panel title="Burndown">
        <Burndown />
      </Panel>
      <Panel title="Work item status">
        <WorkStatus />
      </Panel>
      <Panel title="Recent activity" link={{ label: 'All', href: '/main/team' }}>
        <RecentActivity />
      </Panel>
    </>
  );
};
