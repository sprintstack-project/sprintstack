import { Card } from '@ui/card';
import { clsx } from 'clsx';
import Link from 'next/link';
import { formatDays, type summaryOf, VELOCITY } from './data';

const poster = 'headline text-[4.5rem] leading-[0.92] tabular-nums';

const badge =
  'inline-flex h-7 shrink-0 items-center rounded-full px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap uppercase tracking-[.03em] font-stretch-condensed';

const Velocity = () => {
  const average = Math.round(VELOCITY.reduce((a, v) => a + v.points, 0) / VELOCITY.length);
  const highest = Math.max(...VELOCITY.map((v) => v.points));
  const first = VELOCITY[0].sprint;
  const last = VELOCITY.at(-1)?.sprint;
  const points = VELOCITY.map((v) => v.points).join(', ');
  return (
    <Card variant="tile" tone="muted" eyebrow="Velocity · last 3 sprints">
      <div className="flex items-end justify-between gap-4">
        <p className={poster}>{average}</p>
        <div
          role="img"
          aria-label={`Points completed in sprints ${first}–${last}: ${points}`}
          className="flex h-16 items-end gap-2"
        >
          {VELOCITY.map((v, i) => (
            <span
              key={v.sprint}
              className={clsx(
                'w-8 rounded-lg',
                i === VELOCITY.length - 1 ? 'bg-ink' : 'bg-line-strong',
              )}
              style={{ height: `${(v.points / highest) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <p className="text-body-strong text-ink-muted font-stretch-semi-condensed">
        Sprints {first}–{last}: {points} pts
      </p>
    </Card>
  );
};

interface SummaryTilesProps {
  summary: ReturnType<typeof summaryOf>;
  /** Who is over their own capacity, if anyone. */
  overload: string | null;
}

const SummaryTiles = ({ summary, overload }: SummaryTilesProps) => {
  const over = summary.committed - summary.capacity;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card variant="tile" tone="ink" eyebrow="Team availability">
        <p className={poster}>
          {formatDays(summary.available)} <em className="text-brand-ink">days</em>
        </p>
        <p className="text-body-strong font-stretch-semi-condensed">
          of {summary.total} · {formatDays(summary.off)} days off
          {summary.holidays > 0 &&
            ` · ${summary.holidays} public ${summary.holidays === 1 ? 'holiday' : 'holidays'}`}
        </p>
      </Card>
      <section
        aria-label="Committed vs capacity"
        className={clsx(
          'flex min-h-50 min-w-0 flex-col justify-between gap-4 rounded-2xl border-2 bg-surface p-8 text-ink',
          over > 0 ? 'border-danger' : 'border-line',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow">Committed vs capacity</span>
          <span
            className={clsx(
              badge,
              over > 0 ? 'bg-danger text-on-danger' : 'bg-neutral-subtle text-ink-muted',
            )}
          >
            {over > 0 ? `Over by ${over} pts` : over === 0 ? 'Full' : `${-over} pts free`}
          </span>
        </div>
        <p className={poster}>
          {summary.committed}
          <span className="text-ink-muted">/{summary.capacity}</span>{' '}
          <span className="text-[2rem]">pts</span>
        </p>
        <div className="flex flex-col gap-1 text-body-strong font-stretch-semi-condensed">
          {overload && <p>{overload}</p>}
          {over > 0 && (
            <Link href="/backlog" className="kbd-focus link self-start rounded-xs">
              Rebalance in backlog
            </Link>
          )}
          {over <= 0 && !overload && <p className="text-ink-muted">Everyone’s work fits.</p>}
        </div>
      </section>
      <div className="md:col-span-2 xl:col-span-1 grid">
        <Velocity />
      </div>
    </div>
  );
};

export default SummaryTiles;
