import { scaled, touchSlop } from '@lib/scale';
import { twMerge } from '@lib/tw-merge';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/Text';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';
import { Pressable } from 'react-native';

type Variant = NonNullable<ButtonProps['variant']>;

// Native text doesn't inherit colour from its parent, so the label and icon get it directly.
const variants: Record<Exclude<Variant, 'link'>, { box: string; label: string; icon: string }> = {
  primary: {
    box: 'border-transparent bg-ink active:opacity-85',
    label: 'text-on-ink',
    icon: 'on-ink',
  },
  brand: {
    box: 'border-transparent bg-brand active:bg-brand-hover',
    label: 'text-on-brand',
    icon: 'on-brand',
  },
  secondary: { box: 'border-ink active:bg-surface-pressed', label: 'text-ink', icon: 'ink' },
  danger: {
    box: 'border-brand active:bg-brand-subtle',
    label: 'text-brand-ink',
    icon: 'brand-ink',
  },
  ghost: { box: 'border-transparent active:bg-surface-pressed', label: 'text-ink', icon: 'ink' },
};

const sizes = {
  sm: { box: 'h-10 px-4', label: 'text-[0.9375rem]', iconOnly: 'size-10' },
  md: { box: 'h-12 px-6', label: 'text-[1.0625rem]', iconOnly: 'size-12' },
  lg: { box: 'h-14 px-8', label: 'text-[1.1875rem]', iconOnly: 'size-14' },
};

// Pad the touch area to 44pt, whatever the scale (spec heights: sm 40, md 48, lg 56).
const hitSlop = { sm: touchSlop(40), md: touchSlop(48), lg: touchSlop(56) };

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: IconStart,
  iconEnd: IconEnd,
  iconOnly,
  disabled,
  onClick,
}: ButtonProps) {
  const isLink = variant === 'link';
  const style = isLink ? null : variants[variant];
  const iconColor = useTokenColor(disabled ? 'ink-disabled' : (style?.icon ?? 'brand-ink'));
  const label = typeof children === 'string' ? children : undefined;
  const iconProps = {
    size: scaled(24),
    strokeWidth: 2,
    color: iconColor,
    'aria-hidden': true,
  } as const;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={iconOnly ? label : undefined}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onClick}
      hitSlop={hitSlop[size]}
      className={twMerge(
        clsx(
          'flex-row items-center justify-center',
          isLink
            ? 'justify-start gap-1 active:opacity-70'
            : [
                'gap-2 rounded-full border-2 active:scale-[.98]',
                style?.box,
                iconOnly ? sizes[size].iconOnly : sizes[size].box,
                iconOnly && variant === 'ghost' && 'border-line',
                disabled && 'border-transparent bg-surface-pressed',
              ],
        ),
      )}
    >
      {IconStart && <IconStart {...iconProps} />}
      {!iconOnly && (
        <Text
          className={clsx(
            'font-extrabold leading-5',
            isLink ? 'text-[1rem] underline' : sizes[size].label,
            disabled ? 'text-ink-disabled' : isLink ? 'text-brand-ink' : style?.label,
          )}
        >
          {children}
        </Text>
      )}
      {IconEnd && !iconOnly && <IconEnd {...iconProps} />}
    </Pressable>
  );
}
