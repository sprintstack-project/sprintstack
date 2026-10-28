import { Text } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { type AnimatedRef } from 'react-native-reanimated';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);
const ScrollView = withUniwind(Animated.ScrollView);

/**
 * The frame of every signed-in screen, below the layout's AppHeader (which keeps clear of the top).
 * The tab bar (phones) and the sidebar (tablets) keep clear of the bottom and left edges, so only
 * the right inset is handled here. `fab` floats over the bottom-right corner, outside the scroll.
 * `scrollRef` lets drag-and-drop scroll the screen while an item is held near its edges.
 */
export const MainScreen = ({
  title,
  fab,
  scrollRef,
  children,
}: {
  title?: string;
  fab?: ReactNode;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  children?: ReactNode;
}) => (
  <SafeAreaView edges={['right']} className="flex-1 bg-canvas">
    {/* Extra bottom padding keeps the last row clear of the floating button. */}
    <ScrollView
      ref={scrollRef}
      contentContainerClassName={`gap-6 px-6 pt-6 ${fab ? 'pb-28' : 'pb-10'}`}
    >
      {/* Screens with their own heading (the dashboard's greeting) leave it out. */}
      {title && (
        <Text accessibilityRole="header" className="text-headline uppercase text-ink">
          {title}
        </Text>
      )}
      {children}
    </ScrollView>
    {fab && <View className="absolute right-6 bottom-6">{fab}</View>}
  </SafeAreaView>
);
