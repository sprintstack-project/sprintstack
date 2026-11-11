import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import Card from '@ui/card';
import { differenceInDays, format } from 'date-fns';
import { Suspense, use } from 'react';
import { SPRINT } from '../data';
import ErrorWrapper from '../error-wrapper';
import { SprintTileSkeleton } from '../skeletons';

const SprintTile = ({ sprint: sprintPromise }: { sprint: Promise<Sprint | null> }) => {
  const sprint = use(sprintPromise);
  const progress = (SPRINT.pointsDone / SPRINT.pointsTotal) * 100;

  return (
    <ErrorWrapper label="the current sprint">
      <Suspense fallback={<SprintTileSkeleton />}>
        <Card variant="ink">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              {sprint && (
                <span className="eyebrow text-current">
                  {sprint.name}
                  {sprint.startDate && ` · ${format(sprint.startDate, 'd MMM')}`}
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
                <span className="text-meta font-semibold font-stretch-semi-condensed">
                  points done
                </span>
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
              <div
                className="h-full rounded-full bg-brand-on-ink"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Card>{' '}
      </Suspense>
    </ErrorWrapper>
  );
};

export default SprintTile;
