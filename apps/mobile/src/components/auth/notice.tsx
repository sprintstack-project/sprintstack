import { Text } from '@sprintstack/ui';
import { Check, CircleAlert, Info } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';

const tones = {
  danger: {
    box: 'border-[1.5px] border-danger bg-surface-muted',
    color: 'danger',
    Icon: CircleAlert,
  },
  success: { box: 'border border-success bg-success-subtle', color: 'success-ink', Icon: Check },
  info: { box: 'border border-line bg-surface-muted', color: 'ink-muted', Icon: Info },
};

/**
 * A boxed message: an error (wrong password), a success (reset link sent) or something to know
 * before going on (what signing up creates).
 */
export const Notice = ({
  tone,
  title,
  children,
}: {
  tone: keyof typeof tones;
  title?: string;
  children?: ReactNode;
}) => {
  const { box, color, Icon } = tones[tone];
  const iconColor = useTokenColor(color);
  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
      className={`flex-row items-start gap-3 rounded-2xl px-4.5 py-4 ${box}`}
    >
      <Icon color={iconColor} size={20} strokeWidth={2} />
      <View className="flex-1 gap-0.5">
        {title && (
          <Text className="text-[1.0625rem] leading-5.5 font-extrabold uppercase text-ink">
            {title}
          </Text>
        )}
        {children && (
          <Text
            className={`text-[0.9375rem] leading-5 font-semibold ${title ? 'text-ink-muted' : 'text-ink'}`}
          >
            {children}
          </Text>
        )}
      </View>
    </View>
  );
};

/** "──── or with email ────" */
export const OrDivider = () => {
  return (
    <View
      className="flex-row items-center gap-4"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View className="h-px flex-1 bg-line" />
      <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
        or with email
      </Text>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
};
