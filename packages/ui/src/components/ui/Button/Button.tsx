import { Button as BaseButton } from '@base-ui/react/button';
import { twMerge } from '@lib/tw-merge';
import { buttonClass } from '@ui/button/button-class';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring';

// Icons follow the system: 24px, 2px stroke, coloured by the label.
const iconClass = 'size-6 shrink-0';

const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon: IconStart,
  iconEnd: IconEnd,
  iconOnly,
  disabled,
  onClick,
}: ButtonProps) => {
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
};

export default Button;
