import { scaled } from '@lib/scale';
import { isImageUrl, STATUS_LABEL } from '@lib/status';
import { useTokenColor } from '@lib/use-token-color.native';
import { Badge } from '@ui/Badge/Badge';
import type { Option } from '@ui/types';
import { clsx } from 'clsx';
import { Image, Text, View } from 'react-native';

// Written out in full: Tailwind only generates classes it can find verbatim.
const textClass = {
  'ink-disabled': 'text-ink-disabled',
  'brand-ink': 'text-brand-ink',
  ink: 'text-ink',
};

export const optionText = <V,>(option: Option<V>) =>
  option.label ?? (option.status ? STATUS_LABEL[option.status] : String(option.value));

/** What an option shows, in the sheet and in the trigger: icon or avatar, then a badge or label. */
export function OptionContent<V>({
  option,
  inTrigger,
}: {
  option: Option<V>;
  inTrigger?: boolean;
}) {
  const Icon = option.icon;
  const tone = option.disabled ? 'ink-disabled' : option.danger ? 'brand-ink' : 'ink';
  const iconColor = useTokenColor(tone);
  return (
    <>
      {Icon && <Icon aria-hidden size={scaled(24)} strokeWidth={2} color={iconColor} />}
      {option.avatar &&
        (isImageUrl(option.avatar) ? (
          <Image
            source={{ uri: option.avatar }}
            accessibilityIgnoresInvertColors
            className="size-7 rounded-full"
          />
        ) : (
          <View
            aria-hidden
            className="size-7 items-center justify-center rounded-full bg-ink-muted"
          >
            <Text className="text-[0.6875rem] font-bold text-on-ink">{option.avatar}</Text>
          </View>
        ))}
      {option.status ? (
        <Badge tone={option.status}>{option.label}</Badge>
      ) : (
        <Text
          numberOfLines={1}
          className={clsx('shrink text-[1.0625rem] leading-6', textClass[tone])}
        >
          {option.label}
        </Text>
      )}
      {option.description && !inTrigger && (
        <Text className="ml-auto pl-2 text-meta font-semibold text-ink-muted">
          {option.description}
        </Text>
      )}
    </>
  );
}
