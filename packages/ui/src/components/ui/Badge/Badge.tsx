import { STATUS_CLASSES, STATUS_LABEL } from '@lib/status';
import type { BadgeProps } from '@ui/types';
import { clsx } from 'clsx';

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex h-7 items-center rounded-full px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap uppercase tracking-[.03em] font-stretch-condensed',
        STATUS_CLASSES[tone].box,
        STATUS_CLASSES[tone].text,
      )}
    >
      {children ?? STATUS_LABEL[tone]}
    </span>
  );
}
