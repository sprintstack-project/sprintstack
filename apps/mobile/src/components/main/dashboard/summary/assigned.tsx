import type { WorkItem } from '@sprintstack/api-client/documents/work-items';
import Card from '@ui/card';
import Text from '@ui/text';
import { isAfter, isSameDay, isSameWeek, parseISO, startOfDay } from 'date-fns';
import { View } from 'react-native';
import { Loadable, type QueryState } from '../loadable';
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

const AssignedTile = ({ userWorkItems: query }: { userWorkItems: QueryState<WorkItem[]> }) => (
  <Loadable query={query} label="your assigned items" skeleton={<StatTileSkeleton />}>
    {(userWorkItems) => {
      const openItems = userWorkItems.filter((item) => item.status !== 'done');
      const due = countDue(openItems, startOfDay(new Date()));
      return (
        <Card variant="muted">
          <Text className="text-eyebrow font-bold uppercase text-ink">Assigned to you</Text>
          <View className="flex-1" />
          <Text className="text-[4.5rem] leading-[4.25rem] font-extrabold uppercase text-ink">
            {openItems.length}
          </Text>
          <Text className="text-body-strong text-ink">
            <Text className="text-body-strong text-danger">{due.dueToday} due today</Text> ·{' '}
            {due.dueThisWeek} this week
          </Text>
        </Card>
      );
    }}
  </Loadable>
);

export default AssignedTile;
