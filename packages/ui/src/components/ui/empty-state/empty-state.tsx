import type { EmptyStateProps } from '@ui/types';
import { clsx } from 'clsx';

const description =
  'text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed';

// The bars step down from right to left, like work moving along a board.
const bars = [
  { key: 'top', offset: 'translate-x-8' },
  { key: 'middle', offset: 'translate-x-0' },
  { key: 'bottom', offset: '-translate-x-8' },
] as const;

const Art = ({ solid }: { solid: 'top' | 'middle' | 'bottom' }) => (
  <div aria-hidden className="mb-8 flex flex-col items-center gap-3">
    {bars.map((bar) => (
      <span
        key={bar.key}
        className={clsx(
          'h-10 w-40 rounded-lg',
          bar.offset,
          bar.key === solid ? 'bg-brand' : 'border-2 border-dashed border-line-strong',
        )}
      />
    ))}
  </div>
);

const EmptyState = ({
  variant = 'page',
  eyebrow,
  title,
  highlight,
  description: text,
  art = 'middle',
  icon: Icon,
  actions,
}: EmptyStateProps) => {
  if (variant === 'widget') {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border-[1.5px] border-dashed border-line-strong px-6 py-10 text-center">
        {Icon && (
          <span className="mb-4 grid size-14 place-items-center rounded-full bg-surface-muted text-ink-muted">
            <Icon aria-hidden strokeWidth={2} className="size-6" />
          </span>
        )}
        <h3 className="headline text-title text-ink">{title}</h3>
        {text && <p className={clsx(description, 'mt-2 max-w-sm')}>{text}</p>}
        {actions && <div className="mt-3">{actions}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {art && <Art solid={art} />}
      {eyebrow && <p className="eyebrow text-ink-muted">{eyebrow}</p>}
      <h2 className="headline mt-2 text-[3.5rem] leading-[0.92] text-ink">
        {title}
        {/* The space keeps the heading's accessible name two words apart across the line break. */}
        {highlight && (
          <>
            {' '}
            <span className="block text-brand-ink">{highlight}</span>
          </>
        )}
      </h2>
      {text && <p className={clsx(description, 'mt-4 max-w-xl')}>{text}</p>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
};

export default EmptyState;
