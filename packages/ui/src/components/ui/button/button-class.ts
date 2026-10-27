import { twMerge } from '@lib/tw-merge';
import type { ButtonProps } from '@ui/types';
import { clsx } from 'clsx';

const variants = {
  primary: 'border-transparent bg-ink text-on-ink not-disabled:hover:opacity-85',
  brand: 'border-transparent bg-brand text-on-brand not-disabled:hover:bg-brand-hover',
  secondary: 'border-ink text-ink not-disabled:hover:bg-surface-hover',
  danger: 'border-brand text-brand-ink not-disabled:hover:bg-brand-subtle',
  ghost: 'border-transparent text-ink not-disabled:hover:bg-surface-hover',
};

const ghostIconOnly = 'border-line text-ink not-disabled:hover:bg-surface-hover';

const sizes = {
  sm: 'h-10 px-4 text-[0.9375rem] leading-5',
  md: 'h-12 px-6 text-[1.0625rem] leading-5',
  lg: 'h-14 px-8 text-[1.1875rem] leading-5',
};

const iconOnlySizes = { sm: 'size-10', md: 'size-12', lg: 'size-14' };

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring';

/** The filled/outlined button look for links and form submit buttons. */
export const buttonClass = (
  variant: Exclude<ButtonProps['variant'], 'link'> = 'secondary',
  size: NonNullable<ButtonProps['size']> = 'md',
  iconOnly = false,
) =>
  twMerge(
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
