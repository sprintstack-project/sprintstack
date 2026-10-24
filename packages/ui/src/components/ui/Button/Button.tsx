import { Button as BaseButton } from '@base-ui/react/button';
import { cn } from '../../../lib/cn';
import { Icon } from '../Icon/Icon';
import type { ButtonProps } from '../types';

// Each variant sets its own border colour: a shared border-transparent would win the cascade.
const variants = {
  primary: 'border-transparent bg-ink text-on-ink enabled:hover:opacity-85',
  brand: 'border-transparent bg-brand text-on-brand enabled:hover:bg-brand-hover',
  secondary: 'border-ink text-ink enabled:hover:bg-surface-hover',
  danger: 'border-brand text-brand-ink enabled:hover:bg-brand-subtle',
  ghost: 'border-transparent text-ink enabled:hover:bg-surface-hover',
};

// Icon-only ghost buttons get a hairline so they still read as buttons.
const ghostIconOnly = 'border-line text-ink enabled:hover:bg-surface-hover';

const sizes = {
  sm: 'h-10 px-4 text-[15px]',
  md: 'h-12 px-6 text-[17px]',
  lg: 'h-14 px-8 text-[19px]',
};

const iconOnlySizes = { sm: 'size-10', md: 'size-12', lg: 'size-14' };

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring';

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  iconOnly,
  disabled,
  onClick,
}: ButtonProps) {
  if (variant === 'link') {
    return (
      <BaseButton
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'link inline-flex cursor-pointer items-center gap-1 rounded-xs text-[16px] leading-5',
          'enabled:hover:text-brand-hover data-disabled:cursor-not-allowed data-disabled:text-ink-disabled',
          focus,
        )}
      >
        {icon && <Icon name={icon} />}
        {children}
        {iconEnd && <Icon name={iconEnd} />}
      </BaseButton>
    );
  }

  return (
    <BaseButton
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full',
        'border-2 font-sans font-extrabold leading-5 font-stretch-condensed',
        'transition-[background-color,opacity,transform] duration-120 ease-out enabled:active:scale-[.98]',
        'motion-reduce:transition-none motion-reduce:enabled:active:scale-100',
        iconOnly && variant === 'ghost' ? ghostIconOnly : variants[variant],
        iconOnly ? cn(iconOnlySizes[size], 'p-0') : sizes[size],
        'data-disabled:cursor-not-allowed data-disabled:border-transparent data-disabled:bg-surface-pressed data-disabled:text-ink-disabled',
        focus,
      )}
    >
      {icon && <Icon name={icon} />}
      {iconOnly ? <span className="sr-only">{children}</span> : children}
      {iconEnd && !iconOnly && <Icon name={iconEnd} />}
    </BaseButton>
  );
}
