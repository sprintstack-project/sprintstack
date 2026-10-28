import { Text } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);

/**
 * The frame of every signed-in screen, below the layout's AppHeader (which keeps clear of the top).
 * The tab bar (phones) and the sidebar (tablets) keep clear of the bottom and left edges, so only
 * the right inset is handled here.
 */
export const MainScreen = ({ title, children }: { title: string; children?: ReactNode }) => (
  <SafeAreaView edges={['right']} className="flex-1 bg-canvas">
    <ScrollView contentContainerClassName="gap-6 px-6 pt-6 pb-10">
      <Text accessibilityRole="header" className="text-headline uppercase text-ink">
        {title}
      </Text>
      {children}
    </ScrollView>
  </SafeAreaView>
);
