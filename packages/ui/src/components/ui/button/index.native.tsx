import { scaled, touchSlop } from '@lib/scale';
import { twMerge } from '@lib/tw-merge';
import { useButtonStatus } from '@lib/use-button-status';
import { useTokenColor } from '@lib/use-token-color.native';
import Spinner from '@ui/spinner';
import Text from '@ui/text';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';
import { ImpactFeedbackStyle, impactAsync } from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

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

// Fire-and-forget: the tap shouldn't wait on the haptic engine, and devices without one just no-op.
const tapFeedback = () => {
  impactAsync(ImpactFeedbackStyle.Light).catch(() => {});
};

const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon: IconStart,
  iconEnd: IconEnd,
  iconOnly,
  fullwidth,
  disabled,
  onClick,
  status,
  pendingLabel,
  doneLabel,
}: ButtonProps) => {
  const shown = useButtonStatus(status);
  const isLink = variant === 'link';
  const working = !isLink && shown !== 'idle';
  const style = isLink ? null : variants[variant];
  const iconColor = useTokenColor(disabled ? 'ink-disabled' : (style?.icon ?? 'brand-ink'));
  const label = typeof children === 'string' ? children : undefined;
  const current = shown === 'pending' ? pendingLabel : shown === 'done' ? doneLabel : undefined;
  const iconProps = {
    size: scaled(24),
    strokeWidth: 2,
    color: iconColor,
    'aria-hidden': true,
  } as const;

  const labelText = (text: ButtonProps['children']) => (
    <Text
      className={clsx(
        'font-extrabold leading-5',
        isLink ? 'text-[1rem] underline' : sizes[size].label,
        disabled ? 'text-ink-disabled' : isLink ? 'text-brand-ink' : style?.label,
      )}
    >
      {text}
    </Text>
  );

  return (
    <Pressable
      accessibilityRole="button"
      // The hidden labels that hold the width would otherwise be read too.
      accessibilityLabel={isLink ? undefined : (current ?? label)}
      accessibilityState={{ disabled: Boolean(disabled), busy: shown === 'pending' }}
      disabled={disabled || working}
      onPress={() => {
        tapFeedback();
        onClick?.();
      }}
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
          fullwidth && 'self-stretch',
        ),
      )}
    >
      {iconOnly || isLink ? (
        <>
          {iconOnly && shown === 'pending' ? (
            <Spinner size={24} color={iconColor} />
          ) : (
            IconStart && <IconStart {...iconProps} />
          )}
          {!iconOnly && labelText(children)}
          {IconEnd && !iconOnly && <IconEnd {...iconProps} />}
        </>
      ) : (
        // All three labels stack in a column so the button is as wide as the widest; the
        // inactive ones collapse to no height and stay hidden.
        <View>
          {(['idle', 'pending', 'done'] as const).map((layer) => (
            <View
              key={layer}
              accessibilityElementsHidden={layer !== shown}
              importantForAccessibility={layer === shown ? 'auto' : 'no-hide-descendants'}
              className={clsx(
                'flex-row items-center justify-center gap-2',
                layer !== shown && 'h-0 overflow-hidden opacity-0',
              )}
            >
              {layer === 'idle' && IconStart && <IconStart {...iconProps} />}
              {layer === 'pending' && <Spinner size={20} color={iconColor} />}
              {layer === 'done' && <Check {...iconProps} size={scaled(20)} strokeWidth={2.5} />}
              {labelText(
                layer === 'pending'
                  ? (pendingLabel ?? children)
                  : layer === 'done'
                    ? (doneLabel ?? children)
                    : children,
              )}
              {layer === 'idle' && IconEnd && <IconEnd {...iconProps} />}
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
};

export default Button;
