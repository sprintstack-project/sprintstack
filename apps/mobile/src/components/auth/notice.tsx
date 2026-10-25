import { Text } from '@sprintstack/ui';
import { Check, CircleAlert } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';

/** A boxed message: an error (wrong password) or a success (reset link sent). */
export const Notice = ({
  tone,
  title,
  children,
}: {
  tone: 'danger' | 'success';
  title: string;
  children?: ReactNode;
}) => {
  const danger = tone === 'danger';
  const iconColor = useTokenColor(danger ? 'danger' : 'success-ink');
  const Icon = danger ? CircleAlert : Check;
  return (
    <View
      accessibilityRole={danger ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
      className={
        danger
          ? 'flex-row items-start gap-3 rounded-2xl border-[1.5px] border-danger bg-surface-muted px-4.5 py-4'
          : 'flex-row items-start gap-3 rounded-2xl border border-success bg-success-subtle px-4.5 py-4'
      }
    >
      <Icon color={iconColor} size={20} strokeWidth={2} />
      <View className="flex-1 gap-0.5">
        <Text className="text-[1.0625rem] leading-5.5 font-extrabold uppercase text-ink">
          {title}
        </Text>
        {children && (
          <Text className="text-[0.9375rem] leading-5 font-semibold text-ink-muted">
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
