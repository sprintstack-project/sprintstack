import { Button as BaseButton } from '@base-ui/react/button';
import { twMerge } from '@lib/tw-merge';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';

// Each variant sets its own border colour: a shared border-transparent would win the cascade.
const variants = {
  primary: 'border-transparent bg-ink text-on-ink not-disabled:hover:opacity-85',
  brand: 'border-transparent bg-brand text-on-brand not-disabled:hover:bg-brand-hover',
  secondary: 'border-ink text-ink not-disabled:hover:bg-surface-hover',
  danger: 'border-brand text-brand-ink not-disabled:hover:bg-brand-subtle',
  ghost: 'border-transparent text-ink not-disabled:hover:bg-surface-hover',
};

// Icon-only ghost buttons get a hairline so they still read as buttons.
const ghostIconOnly = 'border-line text-ink not-disabled:hover:bg-surface-hover';

// leading-* must follow the font size: twMerge drops a line height that precedes one.
const sizes = {
  sm: 'h-10 px-4 text-[0.9375rem] leading-5',
  md: 'h-12 px-6 text-[1.0625rem] leading-5',
  lg: 'h-14 px-8 text-[1.1875rem] leading-5',
};

const iconOnlySizes = { sm: 'size-10', md: 'size-12', lg: 'size-14' };

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring';

// Icons follow the system: 24px, 2px stroke, coloured by the label.
const iconClass = 'size-6 shrink-0';

/**
 * The filled/outlined button look, for elements that can't be a Button: links styled as buttons
 * (`<a className={buttonClass('primary', 'sm')}>`) and form submit buttons.
 */
export function buttonClass(
  variant: Exclude<ButtonProps['variant'], 'link'> = 'secondary',
  size: NonNullable<ButtonProps['size']> = 'md',
  iconOnly = false,
) {
  return twMerge(
    clsx(
      'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full',
      'border-2 font-sans font-extrabold font-stretch-condensed',
      'transition-[background-color,opacity,transform] duration-120 ease-out not-disabled:active:scale-[.98]',
      'motion-reduce:transition-none motion-reduce:not-disabled:active:scale-100',
      iconOnly && variant === 'ghost' ? ghostIconOnly : variants[variant],
      iconOnly ? [iconOnlySizes[size], 'p-0', 'leading-5'] : sizes[size],
      'data-disabled:cursor-not-allowed data-disabled:border-transparent data-disabled:bg-surface-pressed data-disabled:text-ink-disabled',
      focus,
    ),
  );
}

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
  if (variant === 'link') {
    return (
      <BaseButton
        disabled={disabled}
        onClick={onClick}
        className={twMerge(
          clsx(
            'link inline-flex cursor-pointer items-center gap-1 rounded-xs text-[1rem] leading-5',
            'enabled:hover:text-brand-hover data-disabled:cursor-not-allowed data-disabled:text-ink-disabled',
            focus,
          ),
        )}
      >
        {IconStart && <IconStart aria-hidden strokeWidth={2} className={iconClass} />}
        {children}
        {IconEnd && <IconEnd aria-hidden strokeWidth={2} className={iconClass} />}
      </BaseButton>
    );
  }

  return (
    <BaseButton
      disabled={disabled}
      onClick={onClick}
      className={buttonClass(variant, size, iconOnly)}
    >
      {IconStart && <IconStart aria-hidden strokeWidth={2} className={iconClass} />}
      {iconOnly ? <span className="sr-only">{children}</span> : children}
      {IconEnd && !iconOnly && <IconEnd aria-hidden strokeWidth={2} className={iconClass} />}
    </BaseButton>
  );
}
