import { Sidebar, Text, useSidebar } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);

/**
 * The frame of every signed-in screen. The tab bar (phones) and the sidebar (tablets) keep clear of
 * the bottom and left edges themselves, so only the top and right insets are handled here.
 */
export const MainScreen = ({ title, children }: { title: string; children?: ReactNode }) => {
  const { drawer } = useSidebar();
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-canvas">
      {/* Tablets get the collapse toggle; phones navigate with the tab bar instead. */}
      {!drawer && (
        <View className="flex-row items-center border-b border-line px-4 py-2">
          <Sidebar.Toggle />
        </View>
      )}
      <ScrollView contentContainerClassName="gap-6 px-6 pt-6 pb-10">
        <Text accessibilityRole="header" className="text-headline uppercase text-ink">
          {title}
        </Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
