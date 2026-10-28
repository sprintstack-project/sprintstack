import { Badge, Text } from '@sprintstack/ui';
import { View } from 'react-native';
import type { WorkItem } from './data';
import { Avatar, Points, PriorityIcon, Tag, TypeIcon } from './parts';

/** A work item in the list. */
export const ItemCard = ({ item }: { item: WorkItem }) => {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <TypeIcon type={item.type} />
        <Text className="text-meta font-semibold text-ink-muted">{item.key}</Text>
        <PriorityIcon level={item.priority} />
        <View className="flex-1" />
        <Points points={item.points} />
        <Avatar person={item.assignee} />
      </View>
      <Text className="text-[1.25rem] leading-6 font-extrabold text-ink">{item.title}</Text>
      <View className="flex-row flex-wrap items-center gap-2">
        <Badge tone={item.status} />
        {item.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </View>
    </View>
  );
};
