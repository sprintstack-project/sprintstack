import { Badge, Text } from '@sprintstack/ui';
import { View } from 'react-native';
import type { WorkItem } from './data';
import { Avatar, Points, PriorityIcon, Tag, TypeIcon } from './parts';

/** A work item on the Kanban board. The column names the status, so only Blocked gets a badge. */
export const BoardCard = ({ item }: { item: WorkItem }) => {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <TypeIcon type={item.type} />
        <Text className="flex-1 text-meta font-semibold text-ink-muted">{item.key}</Text>
        <PriorityIcon level={item.priority} />
      </View>
      <Text className="text-[1.25rem] leading-6 font-extrabold text-ink">{item.title}</Text>
      {item.progress !== undefined && (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Subtasks done"
          accessibilityValue={{ min: 0, max: 100, now: item.progress }}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <View className="h-full rounded-full bg-brand" style={{ width: `${item.progress}%` }} />
        </View>
      )}
      {item.status === 'danger' && <Badge tone="danger" />}
      <View className="flex-row items-center gap-2">
        <View className="min-w-0 flex-1 flex-row flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </View>
        <Points points={item.points} />
        <Avatar person={item.assignee} />
      </View>
    </View>
  );
};
