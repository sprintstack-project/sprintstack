import { Card } from '@ui/card';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ASSIGNED, AWAITING_REVIEW, SPRINT, SPRINT_DAYS_LEFT } from './data';

const SprintTile = () => {
  const progress = (SPRINT.pointsDone / SPRINT.pointsTotal) * 100;
  return (
    <Card variant="tile" tone="ink">
      <div className="flex h-full flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow text-current">
            {SPRINT.name} · {format(SPRINT.start, 'd MMM')} – {format(SPRINT.end, 'd MMM')}
          </span>
          <span className="inline-flex h-7 items-center rounded-full bg-brand px-3 font-display text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.03em] text-on-brand font-stretch-condensed">
            Active
          </span>
        </div>
        <div className="flex flex-1 flex-wrap items-end justify-between gap-4">
          <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">
            {SPRINT_DAYS_LEFT} days
            <br />
            <span className="text-brand-on-ink">left</span>
          </p>
          <p className="text-right">
            <span className="headline block text-headline tabular-nums">
              {SPRINT.pointsDone}
              <span className="opacity-60">/{SPRINT.pointsTotal}</span>
            </span>
            <span className="text-meta font-semibold font-stretch-semi-condensed">points done</span>
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Sprint points done"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-on-ink/20"
        >
          <div className="h-full rounded-full bg-brand-on-ink" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
};

const AssignedTile = () => {
  return (
    <Card variant="tile" tone="muted" eyebrow="Assigned to you">
      <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{ASSIGNED.total}</p>
      <p className="text-body-strong font-stretch-semi-condensed">
        <span className="text-danger">{ASSIGNED.dueToday} due today</span> · {ASSIGNED.dueThisWeek}{' '}
        this week
      </p>
    </Card>
  );
};

const ReviewTile = () => {
  return (
    <Card variant="tile" tone="brand" eyebrow="Waiting on your review">
      <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{AWAITING_REVIEW}</p>
      <Link
        href="/taskboard"
        className="kbd-focus inline-flex items-center gap-1 self-start rounded-xs text-[1.0625rem] leading-5 font-extrabold underline decoration-2 underline-offset-4 font-stretch-condensed"
      >
        Open review queue
        <ChevronRight aria-hidden strokeWidth={2.5} className="size-5" />
      </Link>
    </Card>
  );
};

const SummaryTiles = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
      <div className="grid md:col-span-2 xl:col-span-1">
        <SprintTile />
      </div>
      <AssignedTile />
      <ReviewTile />
    </div>
  );
};

export default SummaryTiles;
