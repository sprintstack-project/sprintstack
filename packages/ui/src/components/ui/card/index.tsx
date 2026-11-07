import { twMerge } from '@lib/tw-merge';
import type { CardProps } from '@ui/types';

const tile = 'flex min-h-50 flex-col gap-4 rounded-2xl p-8 [&_em]:not-italic';

// Poster second lines go in <em>: brand on ink tiles (darkened in Night, where ink turns light),
// ink on brand tiles.
const variants = {
  panel: 'rounded-xl border border-line bg-surface p-6 text-ink',
  brand: `${tile} bg-brand text-on-brand [&_em]:text-ink`,
  ink: `${tile} bg-ink text-on-ink [&_em]:text-brand-on-ink`,
  muted: `${tile} bg-surface-muted text-ink [&_em]:text-brand-ink`,
};

const Card = ({ variant = 'panel', className, children }: CardProps) => (
  <div className={twMerge('min-w-0', variants[variant], className)}>{children}</div>
);

export default Card;
