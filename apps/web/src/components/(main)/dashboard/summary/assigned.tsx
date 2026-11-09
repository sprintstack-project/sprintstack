'use client';

import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import Card from '@ui/card';
import { isAfter, isSameDay, isSameWeek, parseISO, startOfDay } from 'date-fns';
import { Suspense, use, useSyncExternalStore } from 'react';
import ErrorWrapper from '../error-wrapper';
import { StatTileSkeleton } from '../skeletons';

/** Target dates are date-only values sent as UTC midnight, so keep just the calendar day. */
const parseTargetDate = (targetDate: string) => parseISO(targetDate.slice(0, 10));

const countDue = (items: WorkItem[], today: Date) => {
  const dueDates = items.flatMap((item) =>
    item.targetDate ? [parseTargetDate(item.targetDate)] : [],
  );
  return {
    dueToday: dueDates.filter((due) => isSameDay(due, today)).length,
    // The rest of the week, so an item due today isn't counted twice.
    dueThisWeek: dueDates.filter(
      (due) => isAfter(due, today) && isSameWeek(due, today, { weekStartsOn: 1 }),
    ).length,
  };
};

const AssignedTile = ({
  userWorkItems: userWorkItemsPromise,
}: {
  userWorkItems: Promise<WorkItem[]>;
}) => {
  // The viewer's own day, so it's left out of the server render. A timestamp keeps the snapshot stable.
  const today = useSyncExternalStore(
    () => () => {},
    () => startOfDay(new Date()).getTime(),
    () => null,
  );
  const userWorkItems = use(userWorkItemsPromise);
  const openItems = userWorkItems.filter((item) => item.status !== 'done');
  const due = today === null ? null : countDue(openItems, new Date(today));

  return (
    <ErrorWrapper label="your assigned items">
      <Suspense fallback={<StatTileSkeleton label="your assigned items" />}>
        <Card variant="muted">
          <span className="eyebrow text-current">Assigned to you</span>
          <span className="flex-1" />
          <p className="headline text-[4.5rem] leading-[0.92] tabular-nums">{openItems.length}</p>
          {/* Keeps the line's height until the counts appear, so the tile doesn't shift. */}
          <p className="min-h-lh text-body-strong font-stretch-semi-condensed">
            {due && (
              <>
                <span className="text-danger">{due.dueToday} due today</span> · {due.dueThisWeek}{' '}
                this week
              </>
            )}
          </p>
        </Card>
      </Suspense>
    </ErrorWrapper>
  );
};

export default AssignedTile;
