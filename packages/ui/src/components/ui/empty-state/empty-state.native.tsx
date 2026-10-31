import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { EmptyStateProps } from '@ui/types';
import { clsx } from 'clsx';
import { View } from 'react-native';

// The bars step down from right to left, like work moving along a board.
const bars = [
  { key: 'top', offset: 'translate-x-6' },
  { key: 'middle', offset: 'translate-x-0' },
  { key: 'bottom', offset: '-translate-x-6' },
] as const;

const Art = ({ solid }: { solid: 'top' | 'middle' | 'bottom' }) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    className="mb-6 items-center gap-2.5"
  >
    {bars.map((bar) => (
      <View
        key={bar.key}
        className={clsx(
          'h-8 w-32 rounded-lg',
          bar.offset,
          bar.key === solid ? 'bg-brand' : 'border-2 border-dashed border-line-strong',
        )}
      />
    ))}
  </View>
);

/** A panel's empty state: on a phone the icon sits beside the text, in a dashed row. */
const Widget = ({ title, description, icon: Icon, actions }: EmptyStateProps) => {
  const muted = useTokenColor('ink-muted');
  return (
    <View className="flex-row items-center gap-4 rounded-xl border-[1.5px] border-dashed border-line-strong p-4">
      {Icon && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="size-12 items-center justify-center rounded-full bg-surface-muted"
        >
          <Icon aria-hidden size={scaled(22)} strokeWidth={2} color={muted} />
        </View>
      )}
      <View className="min-w-0 flex-1 gap-1">
        <Text accessibilityRole="header" className="text-title font-extrabold uppercase text-ink">
          {title}
        </Text>
        {description && (
          <Text className="text-meta font-semibold text-ink-muted">{description}</Text>
        )}
        {actions && <View className="mt-1 flex-row">{actions}</View>}
      </View>
    </View>
  );
};

const EmptyState = (props: EmptyStateProps) => {
  if (props.variant === 'widget') return <Widget {...props} />;

  const { eyebrow, title, highlight, description, art = 'middle', actions } = props;
  return (
    <View className="items-center px-5 py-10">
      {art && <Art solid={art} />}
      {eyebrow && (
        <Text className="text-eyebrow font-bold uppercase text-ink-muted">{eyebrow}</Text>
      )}
      <Text
        accessibilityRole="header"
        className="mt-2 text-center text-4xl leading-10 font-extrabold uppercase text-ink"
      >
        {title}
        {highlight && (
          <Text className="text-4xl leading-10 font-extrabold uppercase text-brand-ink">
            {'\n'}
            {highlight}
          </Text>
        )}
      </Text>
      {description && (
        <Text className="mt-4 text-center text-[1.0625rem] leading-6 font-semibold text-ink-muted">
          {description}
        </Text>
      )}
      {actions && <View className="mt-6 gap-3 self-stretch">{actions}</View>}
    </View>
  );
};

export default EmptyState;
