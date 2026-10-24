import { scaled, touchSlop } from '@lib/scale';
import { isImageUrl, isStatusTone } from '@lib/status';
import { twMerge } from '@lib/tw-merge';
import { useTokenColor } from '@lib/use-token-color.native';
import { Badge } from '@ui/badge';
import { Text } from '@ui/text';
import type { ChipProps } from '@ui/types';
import { clsx } from 'clsx';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, View } from 'react-native';

const tones = {
  neutral: { box: 'bg-surface-muted', text: 'text-ink', icon: 'ink' },
  ink: { box: 'bg-ink', text: 'text-on-ink', icon: 'on-ink' },
  outline: { box: 'border-line-strong', text: 'text-ink', icon: 'ink' },
  accent: { box: 'bg-brand', text: 'font-bold text-on-brand', icon: 'on-brand' },
  key: {
    box: 'h-auto border-0 px-0',
    text: 'text-[0.875rem] font-bold text-ink-muted',
    icon: 'ink-muted',
  },
};

const sizes = {
  sm: { box: 'h-[2.125rem] pr-3 pl-3.5', text: 'text-[0.9375rem]' },
  md: { box: 'h-10 px-4', text: 'text-[1rem]' },
};

const Chip = ({
  children,
  tone = 'neutral',
  size,
  dot,
  avatar,
  onRemove,
  toggle,
  pressed,
  defaultPressed,
  onPressedChange,
  count,
}: ChipProps) => {
  const [ownPressed, setOwnPressed] = useState(Boolean(defaultPressed));
  const isPressed = pressed ?? ownPressed;
  const style = tones[tone as keyof typeof tones] ?? tones.neutral;
  const removeColor = useTokenColor(style.icon);

  if (toggle) {
    // Filter pill: outline, filled ink when on. Put several in a horizontal ScrollView.
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isPressed }}
        onPress={() => {
          setOwnPressed(!isPressed);
          onPressedChange?.(!isPressed);
        }}
        hitSlop={touchSlop(40)}
        className={clsx(
          'h-10 flex-row items-center gap-2 self-start rounded-full border-[1.5px] px-4',
          isPressed
            ? 'border-ink bg-ink'
            : 'border-line-strong bg-surface active:bg-surface-pressed',
        )}
      >
        <Text
          className={clsx(
            'text-[1rem] leading-5 font-bold',
            isPressed ? 'text-on-ink' : 'text-ink',
          )}
        >
          {children}
        </Text>
        {count !== undefined && (
          <Text
            className={clsx('font-semibold opacity-70', isPressed ? 'text-on-ink' : 'text-ink')}
          >
            {count}
          </Text>
        )}
      </Pressable>
    );
  }

  // Status tones render as an uppercase badge: the word carries the meaning.
  if (dot || (isStatusTone(tone) && tone !== 'neutral')) {
    return <Badge tone={isStatusTone(tone) ? tone : 'neutral'}>{children}</Badge>;
  }

  const sized = sizes[size ?? (onRemove ? 'sm' : 'md')];
  const label = typeof children === 'string' ? children : undefined;
  return (
    <View
      // twMerge so a tone's border colour replaces the base border-transparent.
      className={twMerge(
        clsx(
          'max-w-full flex-row items-center gap-2 self-start rounded-full border-[1.5px] border-transparent',
          sized.box,
          style.box,
        ),
      )}
    >
      {avatar &&
        (isImageUrl(avatar) ? (
          <Image
            source={{ uri: avatar }}
            accessibilityIgnoresInvertColors
            className="-ml-2 size-[1.375rem] rounded-full"
          />
        ) : (
          <View
            aria-hidden
            className="-ml-2 size-[1.375rem] items-center justify-center rounded-full bg-ink-muted"
          >
            <Text className="text-[0.625rem] font-bold text-on-ink">{avatar}</Text>
          </View>
        ))}
      <Text
        numberOfLines={1}
        className={clsx('shrink leading-5 font-semibold', sized.text, style.text)}
      >
        {children}
      </Text>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label ? `Remove ${label}` : 'Remove'}
          onPress={onRemove}
          // A small button; hitSlop brings the touch target to 44pt.
          hitSlop={touchSlop(22)}
          className="-mr-1.5 size-[1.375rem] items-center justify-center rounded-full active:bg-surface-pressed"
        >
          <X aria-hidden size={scaled(18)} strokeWidth={2} color={removeColor} />
        </Pressable>
      )}
    </View>
  );
};

export default Chip;
