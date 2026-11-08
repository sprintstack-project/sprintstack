import Card from '@ui/card';
import Text from '@ui/text';
import { View } from 'react-native';
import type { Assigned } from '../data';
import { Loadable, type QueryState } from '../loadable';
import { StatTileSkeleton } from '../skeletons';

const AssignedTile = ({ assigned: query }: { assigned: QueryState<Assigned> }) => (
  <Loadable query={query} label="your assigned items" skeleton={<StatTileSkeleton />}>
    {(assigned) => (
      <Card variant="muted">
        <Text className="text-eyebrow font-bold uppercase text-ink">Assigned to you</Text>
        <View className="flex-1" />
        <Text className="text-[4.5rem] leading-[4.25rem] font-extrabold uppercase text-ink">
          {assigned.total}
        </Text>
        <Text className="text-body-strong text-danger">{assigned.dueToday} due today</Text>
      </Card>
    )}
  </Loadable>
);

export default AssignedTile;
