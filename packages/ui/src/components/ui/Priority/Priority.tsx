import { PRIORITY_DIRECTION, PRIORITY_LABEL } from '@lib/status';
import type { PriorityProps } from '@ui/types';
import { clsx } from 'clsx';
import { ArrowDown, ArrowUp, Equal } from 'lucide-react';

const icons = { up: ArrowUp, flat: Equal, down: ArrowDown };

/** An arrow plus the priority's name; the name carries the meaning, the red arrow only helps scanning. */
const Priority = ({ level }: PriorityProps) => {
  const direction = PRIORITY_DIRECTION[level];
  const Icon = icons[direction];
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.9375rem] leading-5 font-bold text-ink-muted font-stretch-semi-condensed">
      <Icon
        aria-hidden
        strokeWidth={2}
        className={clsx(
          'size-[1.125rem] shrink-0',
          direction === 'up' ? 'text-brand-ink' : 'text-ink',
        )}
      />
      {PRIORITY_LABEL[level]}
    </span>
  );
};

export default Priority;
