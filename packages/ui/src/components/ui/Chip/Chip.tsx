import { Toggle } from '@base-ui/react/toggle';
import { isImageUrl, isStatusTone } from '@lib/status';
import { twMerge } from '@lib/tw-merge';
import { Badge } from '@ui/Badge/Badge';
import type { ChipProps } from '@ui/types';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

const tones = {
  neutral: 'bg-surface-muted text-ink',
  ink: 'bg-ink text-on-ink',
  outline: 'border-line-strong text-ink',
  accent: 'bg-brand font-bold text-on-brand',
  key: 'h-auto border-0 px-0 text-[0.875rem] font-bold text-ink-muted',
};

const sizes = { sm: 'h-[2.125rem] pr-3 pl-3.5 text-[0.9375rem]', md: 'h-10 px-4 text-[1rem]' };

const focus = 'focus-visible:outline-2 focus-visible:outline-focus-ring';

export function Chip({
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
}: ChipProps) {
  if (toggle) {
    // Filter pill: outline, filled ink when on.
    return (
      <Toggle
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={(next) => onPressedChange?.(next)}
        className={clsx(
          'inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong bg-surface px-4',
          'text-[1rem] leading-5 font-bold whitespace-nowrap text-ink font-stretch-semi-condensed hover:bg-surface-hover',
          'data-pressed:border-ink data-pressed:bg-ink data-pressed:text-on-ink',
          focus,
          'focus-visible:outline-offset-2',
        )}
      >
        {children}
        {count !== undefined && (
          <span className="font-semibold tabular-nums opacity-70">{count}</span>
        )}
      </Toggle>
    );
  }

  // Status tones render as an uppercase badge: the word carries the meaning.
  if (dot || (isStatusTone(tone) && tone !== 'neutral')) {
    return <Badge tone={isStatusTone(tone) ? tone : 'neutral'}>{children}</Badge>;
  }

  const label = typeof children === 'string' ? children : undefined;
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex max-w-full items-center gap-2 rounded-full border-[1.5px] border-transparent leading-5 font-semibold whitespace-nowrap font-stretch-semi-condensed',
          sizes[size ?? (onRemove ? 'sm' : 'md')],
          tones[tone as keyof typeof tones],
        ),
      )}
    >
      {avatar &&
        (isImageUrl(avatar) ? (
          <img src={avatar} alt="" className="-ml-2 size-[1.375rem] rounded-full object-cover" />
        ) : (
          <span
            aria-hidden
            className="-ml-2 grid size-[1.375rem] place-items-center rounded-full bg-ink-muted text-[0.625rem] font-bold text-on-ink"
          >
            {avatar}
          </span>
        ))}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={label ? `Remove ${label}` : 'Remove'}
          onClick={onRemove}
          className={clsx(
            '-mr-1.5 grid size-[1.375rem] shrink-0 cursor-pointer place-items-center rounded-full hover:bg-ink/15',
            focus,
            'focus-visible:outline-offset-1',
          )}
        >
          <X aria-hidden strokeWidth={2} className="size-[1.125rem]" />
        </button>
      )}
    </span>
  );
}
