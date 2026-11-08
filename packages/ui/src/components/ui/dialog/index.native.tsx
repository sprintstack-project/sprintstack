import { useReducedMotion } from '@lib/motion.native';
import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import * as Primitive from '@rn-primitives/dialog';
import Text from '@ui/text';
import type { DialogProps } from '@ui/types';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 0→1 over 140 ms from mount (the portal mounts on open); straight to 1 under reduced motion. */
const useEnter = () => {
  const reduced = useReducedMotion();
  const [value] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) {
      value.setValue(1);
      return;
    }
    Animated.timing(value, {
      toValue: 1,
      duration: 140,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [reduced, value]);
  return value;
};

const Panel = ({ title, children }: Omit<DialogProps, 'open' | 'onOpenChange'>) => {
  const insets = useSafeAreaInsets();
  const muted = useTokenColor('ink-muted');
  const enter = useEnter();
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="absolute inset-0"
    >
      <Animated.View style={{ flex: 1, opacity: enter }}>
        {/* The backdrop: a press outside the panel closes it. */}
        <Primitive.Overlay asChild>
          <Pressable
            className="flex-1 items-center justify-center bg-scrim px-4"
            style={{
              paddingTop: insets.top + scaled(16),
              paddingBottom: insets.bottom + scaled(16),
            }}
          >
            <Animated.View
              style={{
                width: '100%',
                maxHeight: '100%',
                alignItems: 'center',
                transform: [{ scale }],
              }}
            >
              {/* Content claims touches, so presses inside it don't reach the backdrop. */}
              <Primitive.Content asChild>
                <View className="max-h-full w-full max-w-[36rem] rounded-xl border border-line bg-surface p-6 shadow-popover">
                  <View className="-my-2 flex-row items-center gap-1">
                    <Primitive.Title asChild>
                      <Text className="flex-1 text-title font-extrabold uppercase text-ink">
                        {title}
                      </Text>
                    </Primitive.Title>
                    <Primitive.Close asChild>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        hitSlop={touchSlop(40)}
                        className="-mr-2 size-10 items-center justify-center rounded-full active:bg-surface-pressed"
                      >
                        <X aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
                      </Pressable>
                    </Primitive.Close>
                  </View>
                  {/* RN's ScrollView grows by default; this one only shrinks, so short content hugs. */}
                  <ScrollView className="mt-3 grow-0 shrink" keyboardShouldPersistTaps="handled">
                    {children}
                  </ScrollView>
                </View>
              </Primitive.Content>
            </Animated.View>
          </Pressable>
        </Primitive.Overlay>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

/** Renders into `<PortalHost />` (from @rn-primitives/portal), which the app mounts once at its root. */
const Dialog = ({ open, onOpenChange, ...panel }: DialogProps) => (
  // asChild: no wrapper View left behind in the caller's layout (it would take a `gap`).
  <Primitive.Root asChild open={open} onOpenChange={onOpenChange}>
    <Primitive.Portal>
      <Panel {...panel} />
    </Primitive.Portal>
  </Primitive.Root>
);

export default Dialog;
