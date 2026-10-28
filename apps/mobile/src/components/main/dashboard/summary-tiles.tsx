import { scaled } from '@lib/scale';
import { Card, Text } from '@sprintstack/ui';
import { format } from 'date-fns';
import { type Href, router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { ASSIGNED, AWAITING_REVIEW, SPRINT, SPRINT_DAYS_LEFT } from './data';

const poster = 'text-[4.5rem] leading-[4.25rem] font-extrabold uppercase';

const SprintTile = () => {
  const progress = (SPRINT.pointsDone / SPRINT.pointsTotal) * 100;
  return (
    <Card variant="tile" tone="ink">
      <View className="gap-5">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-eyebrow font-bold uppercase text-on-ink">
            {SPRINT.name} · {format(SPRINT.start, 'd MMM')} – {format(SPRINT.end, 'd MMM')}
          </Text>
          <View className="h-7 justify-center rounded-full bg-brand px-3">
            <Text className="text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.4px] text-on-brand">
              Active
            </Text>
          </View>
        </View>
        <View className="flex-row items-end justify-between gap-4">
          <Text className={`${poster} text-on-ink`}>
            {SPRINT_DAYS_LEFT} days{'\n'}
            <Text className={`${poster} text-brand-on-ink`}>left</Text>
          </Text>
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
          <View className="h-full rounded-full bg-brand-on-ink" style={{ width: `${progress}%` }} />
        </View>
      </View>
    </Card>
  );
};

const AssignedTile = () => {
  return (
    <Card variant="tile" tone="muted" eyebrow="Assigned to you">
      <Text className={`${poster} text-ink`}>{ASSIGNED.total}</Text>
      <Text className="text-body-strong text-danger">{ASSIGNED.dueToday} due today</Text>
    </Card>
  );
};

const ReviewTile = () => {
  const onBrand = useTokenColor('on-brand');
  return (
    <Card variant="tile" tone="brand" eyebrow="To review">
      <Text className={`${poster} text-on-brand`}>{AWAITING_REVIEW}</Text>
      <Pressable
        accessibilityRole="link"
        onPress={() => router.navigate('/main/taskboard' as Href)}
        hitSlop={8}
        className="flex-row items-center gap-1 self-start active:opacity-70"
      >
        <Text className="text-[1.0625rem] leading-5 font-extrabold text-on-brand">Open queue</Text>
        <ArrowRight aria-hidden size={scaled(20)} strokeWidth={2.5} color={onBrand} />
      </Pressable>
    </Card>
  );
};

export const SummaryTiles = () => {
  return (
    <View className="gap-4">
      <SprintTile />
      <View className="flex-row gap-4">
        <View className="flex-1">
          <AssignedTile />
        </View>
        <View className="flex-1">
          <ReviewTile />
        </View>
      </View>
    </View>
  );
};
