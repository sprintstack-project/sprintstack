import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { useTokenColor } from '@/lib/use-token-color';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);

/** The frame of every sign-in and sign-up screen: a header row and a scrolling column. */
export const AuthScreen = ({
  back,
  left,
  right,
  children,
}: {
  /** Show a back button (left). */
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) => {
  const ink = useTokenColor('ink');
  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow gap-6 px-6 pt-2 pb-10"
        >
          <View className="min-h-11 flex-row items-center justify-between gap-4">
            {back ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={() => router.back()}
                hitSlop={8}
                className="-ml-2 size-11 items-center justify-center rounded-full active:bg-surface-pressed"
              >
                <ChevronLeft color={ink} size={24} strokeWidth={2} />
              </Pressable>
            ) : (
              (left ?? <View />)
            )}
            {right}
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
