import type { Sprint } from '@sprintstack/api-client/documents/sprints';
import Card from '@ui/card';
import Text from '@ui/text';
import { differenceInDays, format } from 'date-fns';
import { View } from 'react-native';
import { SPRINT } from '../data';
import { Loadable, type QueryState } from '../loadable';
import { SprintTileSkeleton } from '../skeletons';

const poster = 'text-[4.5rem] leading-[4.25rem] font-extrabold uppercase';

const SprintTile = ({ sprint: query }: { sprint: QueryState<Sprint | null> }) => {
  // TODO: points still come from the placeholder sprint.
  const progress = (SPRINT.pointsDone / SPRINT.pointsTotal) * 100;
  return (
    <Loadable query={query} label="the current sprint" skeleton={<SprintTileSkeleton />}>
      {(sprint) => (
        <Card variant="ink">
          <View className="gap-5">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-eyebrow font-bold uppercase text-on-ink">
                {sprint &&
                  `${sprint.name}${sprint.startDate ? ` · ${format(sprint.startDate, 'd MMM')}` : ''}${sprint.endDate ? ` – ${format(sprint.endDate, 'd MMM')}` : ''}`}
              </Text>
              <View className="h-7 justify-center rounded-full bg-brand px-3">
                <Text className="text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.4px] text-on-brand">
                  Active
                </Text>
              </View>
            </View>
            <View className="flex-row items-end justify-between gap-4">
              {/* An open-ended sprint has no end date, so no countdown. */}
              {sprint?.endDate ? (
                <Text className={`${poster} text-on-ink`}>
                  {differenceInDays(sprint.endDate, new Date())} days{'\n'}
                  <Text className={`${poster} text-brand-on-ink`}>left</Text>
                </Text>
              ) : (
                <View />
              )}
              <View className="items-end">
                <Text className="text-headline font-extrabold text-on-ink">
                  {SPRINT.pointsDone}
                  <Text className="text-headline font-extrabold text-on-ink/60">
                    /{SPRINT.pointsTotal}
                  </Text>
                </Text>
                <Text className="text-meta font-semibold text-on-ink">points done</Text>
              </View>
            </View>
            <View
              accessibilityRole="progressbar"
              accessibilityLabel="Sprint points done"
              accessibilityValue={{ min: 0, max: 100, now: Math.round(progress) }}
              className="h-2 overflow-hidden rounded-full bg-on-ink/20"
            >
              <View
                className="h-full rounded-full bg-brand-on-ink"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        </Card>
      )}
    </Loadable>
  );
};

export default SprintTile;
