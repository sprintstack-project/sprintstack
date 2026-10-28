import { scaled } from '@lib/scale';
import { PRIORITY_LABEL } from '@lib/status';
import { Badge, Text } from '@sprintstack/ui';
import type { Priority } from '@ui/types';
import { Bookmark, Bug, ChevronsUp, ChevronUp, Equal, SquareCheck } from 'lucide-react-native';
import { View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { dueLabel, type ItemType, NEXT_ITEMS } from './data';

const types = {
  bug: { icon: Bug, label: 'Bug', box: 'bg-danger', color: 'on-danger' },
  story: { icon: Bookmark, label: 'Story', box: 'bg-success-subtle', color: 'success-ink' },
  task: { icon: SquareCheck, label: 'Task', box: 'bg-info-subtle', color: 'info-ink' },
} satisfies Record<ItemType, unknown>;

// Compact rows show the arrow alone; the label stays available to screen readers.
const priorities: Partial<Record<Priority, typeof Equal>> = {
  highest: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
};

const TypeIcon = ({ type }: { type: ItemType }) => {
  const { icon: Icon, label, box, color } = types[type];
  const iconColor = useTokenColor(color);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      className={`size-8 items-center justify-center rounded-md ${box}`}
    >
      <Icon aria-hidden size={scaled(18)} strokeWidth={2} color={iconColor} />
    </View>
  );
};

const PriorityIcon = ({ level }: { level: Priority }) => {
  const urgent = level === 'highest' || level === 'high';
  const color = useTokenColor(urgent ? 'danger' : 'ink');
  const Icon = priorities[level] ?? Equal;
  return (
    <View accessibilityRole="image" accessibilityLabel={`${PRIORITY_LABEL[level]} priority`}>
      <Icon aria-hidden size={scaled(20)} strokeWidth={2.5} color={color} />
    </View>
  );
};

export const NextItems = () => {
  return (
    <View>
      {NEXT_ITEMS.map((item, i) => {
        const due = dueLabel(item.due);
        return (
          <View
            key={item.key}
            className={`flex-row items-start gap-4 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <TypeIcon type={item.type} />
            <View className="min-w-0 flex-1 gap-1">
              <View className="flex-row items-center gap-3">
                <Text className="flex-1 text-meta font-semibold text-ink-muted">{item.key}</Text>
                <Text
                  className={`text-meta ${due === 'Today' ? 'font-bold text-danger' : 'font-semibold text-ink-muted'}`}
                >
                  {due}
                </Text>
              </View>
              <Text numberOfLines={1} className="text-body-strong font-bold text-ink">
                {item.title}
              </Text>
              <View className="mt-2 flex-row items-center gap-3">
                <Badge tone={item.status} />
                <PriorityIcon level={item.priority} />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
