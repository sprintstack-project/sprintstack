import { Text } from '@sprintstack/ui';
import { View } from 'react-native';
import type { WorkItem } from '../taskboard/data';
import { Avatar, Points, PriorityIcon, TypeIcon } from '../taskboard/parts';

/** A backlog row: the key and priority above a one-line title. */
export const ItemRow = ({ item }: { item: WorkItem }) => (
  <View className="flex-row items-center gap-3">
    <TypeIcon type={item.type} />
    <View className="min-w-0 flex-1 gap-0.5">
      <View className="flex-row items-center gap-2">
        <Text className="text-meta font-semibold text-ink-muted">{item.key}</Text>
        <PriorityIcon level={item.priority} />
      </View>
      <Text numberOfLines={1} className="text-[1.0625rem] leading-6 font-extrabold text-ink">
        {item.title}
      </Text>
    </View>
    <Points points={item.points} />
    <Avatar person={item.assignee} />
  </View>
);
