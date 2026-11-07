import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import { Card } from '@ui/card';
import { differenceInDays, format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode, use } from 'react';
import { type Assigned, SPRINT } from './data';

export const SprintTile = ({ sprint: sprintPromise }: { sprint: Promise<Sprint | null> }) => {
  const sprint = use(sprintPromise);
  // TODO: points still come from the placeholder sprint.
  const progress = (SPRINT.pointsDone / SPRINT.pointsTotal) * 100;
  return (
    <Card variant="tile" tone="ink">
      <div className="flex h-full flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          {sprint && (
            <span className="eyebrow text-current">
              {sprint.name} · {format(sprint.startDate, 'd MMM')}
              {sprint.endDate && ` – ${format(sprint.endDate, 'd MMM')}`}
            </span>
          )}
          <span className="inline-flex h-7 items-center rounded-full bg-brand px-3 font-display text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.03em] text-on-brand font-stretch-condensed">
            Active
          </span>
        </div>
        <div className="flex flex-1 flex-wrap items-end justify-between gap-4">
          {/* An open-ended sprint has no end date, so no countdown. */}
          {sprint?.endDate && (
            <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">
              {differenceInDays(sprint.endDate, new Date())} days
              <br />
              <span className="text-brand-on-ink">left</span>
            </p>
          )}
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

export const AssignedTile = ({ assigned: assignedPromise }: { assigned: Promise<Assigned> }) => {
  const assigned = use(assignedPromise);
  return (
    <Card variant="tile" tone="muted" eyebrow="Assigned to you">
      <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{assigned.total}</p>
      <p className="text-body-strong font-stretch-semi-condensed">
        <span className="text-danger">{assigned.dueToday} due today</span> · {assigned.dueThisWeek}{' '}
        this week
      </p>
    </Card>
  );
};

export const ReviewTile = ({
  awaitingReview: countPromise,
}: {
  awaitingReview: Promise<number>;
}) => {
  const awaitingReview = use(countPromise);
  return (
    <Card variant="tile" tone="brand" eyebrow="Waiting on your review">
      <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{awaitingReview}</p>
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

interface SummaryTilesProps {
  sprint: ReactNode;
  assigned: ReactNode;
  review: ReactNode;
}

/** Lays out the three tiles. The route fills each slot, with its own Suspense boundary. */
const SummaryTiles = ({ sprint, assigned, review }: SummaryTilesProps) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
    <div className="grid md:col-span-2 xl:col-span-1">{sprint}</div>
    {assigned}
    {review}
  </div>
);

export default SummaryTiles;
