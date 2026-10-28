import { Text } from '@sprintstack/ui';
import { View } from 'react-native';
import { ACTIVITY } from './data';

export const RecentActivity = () => {
  return (
    <View className="gap-5">
      {ACTIVITY.map((item) => (
        <View key={item.id} className="flex-row items-start gap-4">
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="size-10 items-center justify-center rounded-full bg-ink"
          >
            <Text className="text-[0.8125rem] font-extrabold text-on-ink">{item.avatar}</Text>
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-body text-ink-muted">
              <Text className="text-body font-bold text-ink">{item.actor}</Text> {item.action}{' '}
              <Text className="text-body font-bold text-brand-ink">{item.issueKey}</Text>
              {item.target && (
                <>
                  {' '}
                  {item.target.prefix}{' '}
                  <Text className="text-body font-bold text-ink">{item.target.label}</Text>
                </>
              )}
            </Text>
            <Text className="text-meta font-semibold text-ink-muted">{item.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
