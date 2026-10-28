import { STATUS_LABEL } from '@lib/status';
import { type StatusTone, Text } from '@sprintstack/ui';
import { View } from 'react-native';
import { SPRINT, STATUS_COUNTS } from './data';

// Solid fills for the bar and the legend dots.
const fills: Record<StatusTone, string> = {
  neutral: 'bg-ink-muted',
  info: 'bg-info',
  review: 'bg-review',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
};

export const WorkStatus = () => {
  const total = STATUS_COUNTS.reduce((sum, status) => sum + status.count, 0);
  return (
    <View className="gap-5">
      <View className="flex-row items-baseline gap-3">
        <Text className="text-[3.5rem] leading-[3.5rem] font-extrabold text-ink">{total}</Text>
        <Text className="text-meta font-semibold text-ink-muted">items in {SPRINT.name}</Text>
      </View>
      {/* Only the bar's outer ends are rounded; the segments meet square. */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="h-3 flex-row gap-1 overflow-hidden rounded-full"
      >
        {STATUS_COUNTS.map((status) => (
          <View key={status.tone} className={fills[status.tone]} style={{ flex: status.count }} />
        ))}
      </View>
      <View className="flex-row flex-wrap gap-x-5 gap-y-3">
        {STATUS_COUNTS.map((status) => (
          <View key={status.tone} className="flex-row items-center gap-2">
            <View className={`size-3 rounded-xs ${fills[status.tone]}`} />
            <Text className="text-meta font-semibold text-ink-muted">
              {STATUS_LABEL[status.tone]}
            </Text>
            <Text className="text-meta font-extrabold text-ink">{status.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
