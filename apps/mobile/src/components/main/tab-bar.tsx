import { scaled } from '@lib/scale';
import { type IconComponent, Text } from '@sprintstack/ui';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { TABS } from '@/components/main/navigation';
import { useTokenColor } from '@/lib/use-token-color';

/** The phone navigation: tabs with an icon pill that fills in for the current screen. */
export const TabBar = ({ state, emitter, navigateToTab, insets }: BottomTabBarProps) => {
  const current = state.routes[state.index]?.key;

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row border-t border-line bg-canvas px-2 pt-4"
      // Clear the home indicator, or keep a little air on phones without one.
      style={{
        paddingBottom: Math.max(insets.bottom, scaled(16)),
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {TABS.map((tab) => {
        const route = state.routes.find((r) => r.name === tab.key);
        if (!route) return null;
        const focused = route.key === current;

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        const onLongPress = () => emitter.emit({ type: 'tabLongPress', target: route.key });

        return (
          <Tab
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            focused={focused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

const Tab = ({
  label,
  icon: Icon,
  focused,
  onPress,
  onLongPress,
}: {
  label: string;
  icon: IconComponent;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const iconColor = useTokenColor(focused ? 'on-ink' : 'ink-muted');
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center gap-2"
    >
      {({ pressed }) => (
        <>
          <View
            className={`h-10 w-18 items-center justify-center rounded-full ${
              focused ? 'bg-ink' : pressed ? 'bg-surface-pressed' : ''
            }`}
          >
            <Icon aria-hidden size={scaled(28)} strokeWidth={2} color={iconColor} />
          </View>
          <Text
            numberOfLines={1}
            className={`text-[1.0625rem] leading-5 font-bold ${focused ? 'text-ink' : 'text-ink-muted'}`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};
