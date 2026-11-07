'use client';

import { Button as BaseButton } from '@base-ui/react/button';
import { twMerge } from '@lib/tw-merge';
import { useButtonStatus } from '@lib/use-button-status';
import { buttonClass } from '@ui/button/button-class';
import Spinner from '@ui/spinner';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

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
  fullwidth,
  disabled,
  onClick,
  status,
  pendingLabel,
  doneLabel,
}: ButtonProps) => {
  const shown = useButtonStatus(status);

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

  const working = shown !== 'idle';

  // All three labels sit in one grid cell so the button is as wide as the widest; only the
  // current one is visible (and named).
  const layer = (active: boolean) =>
    clsx('inline-flex items-center justify-center gap-2 [grid-area:1/1]', !active && 'invisible');

  return (
    <BaseButton
      disabled={disabled}
      // Pending keeps its colour (it isn't unavailable, just busy) but ignores clicks.
      aria-disabled={working || undefined}
      aria-busy={shown === 'pending' || undefined}
      onClick={working ? undefined : onClick}
      className={twMerge(
        buttonClass(variant, size, iconOnly),
        fullwidth && 'w-full',
        working && 'cursor-default not-disabled:active:scale-100',
        shown === 'pending' && 'cursor-progress',
      )}
    >
      {iconOnly ? (
        <>
          {shown === 'pending' ? (
            <Spinner size={24} />
          ) : (
            IconStart && <IconStart aria-hidden strokeWidth={2} className={iconClass} />
          )}
          <span className="sr-only">{children}</span>
        </>
      ) : (
        <span className="grid">
          <span className={layer(shown === 'idle')}>
            {IconStart && <IconStart aria-hidden strokeWidth={2} className={iconClass} />}
            {children}
            {IconEnd && <IconEnd aria-hidden strokeWidth={2} className={iconClass} />}
          </span>
          <span className={layer(shown === 'pending')}>
            <Spinner size={20} />
            {pendingLabel ?? children}
          </span>
          <span className={layer(shown === 'done')}>
            <Check aria-hidden strokeWidth={2.5} className="size-5 shrink-0" />
            {doneLabel ?? children}
          </span>
        </span>
      )}
    </BaseButton>
  );
};

export default Button;
