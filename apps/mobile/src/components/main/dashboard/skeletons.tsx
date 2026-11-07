import Card from '@ui/card';
import Skeleton from '@ui/skeleton';
import { View } from 'react-native';

// LoadState hides these from screen readers and announces its label once, so they stay silent.

const rows = (count: number) => Array.from({ length: count }, (_, i) => i);

// Tiles: the ink tile inverts in dark mode, so its bones are tinted from its own text colour.
export const SprintTileSkeleton = () => {
  const tint = 'rounded-lg bg-on-ink/15';
  return (
    <Card variant="ink">
      <View className="gap-5">
        <Skeleton tint={tint} />
        <View className="flex-row items-end justify-between gap-4">
          <View className="gap-3">
            <Skeleton shape="input" tint={tint} width={128} />
            <Skeleton shape="input" tint={tint} width={96} />
          </View>
          <Skeleton shape="heading" tint={tint} width={64} />
        </View>
        <Skeleton shape="bar" tint={tint} />
      </View>
    </Card>
  );
};

export const StatTileSkeleton = () => (
  <Card variant="muted">
    <Skeleton width="70%" />
    <View className="flex-1" />
    <Skeleton shape="icon" width={64} />
    <Skeleton width="60%" />
  </Card>
);

// Widget bodies: the panel and its title stay; only its content is a skeleton.

const titleWidths = ['80%', '65%', '90%', '55%'] as const;
const activityWidths = ['85%', '70%', '95%'] as const;

export const NextItemsSkeleton = () => (
  <View>
    {rows(4).map((i) => (
      <View
        key={i}
        className={`flex-row items-start gap-4 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
      >
        <Skeleton shape="icon" width={32} />
        <View className="min-w-0 flex-1 gap-2.5">
          <View className="flex-row justify-between gap-3">
            <Skeleton width={64} />
            <Skeleton width={48} />
          </View>
          <Skeleton width={titleWidths[i]} />
          <View className="mt-1 flex-row items-center gap-3">
            <Skeleton shape="pill" />
            <Skeleton shape="icon" width={20} />
          </View>
        </View>
      </View>
    ))}
  </View>
);

export const ActivitySkeleton = () => (
  <View className="gap-5">
    {rows(3).map((i) => (
      <View key={i} className="flex-row items-center gap-4">
        <Skeleton shape="circle" />
        <View className="min-w-0 flex-1 gap-2.5">
          <Skeleton width={activityWidths[i]} />
          <Skeleton width="40%" />
        </View>
      </View>
    ))}
  </View>
);

export const BurndownSkeleton = () => (
  <View className="gap-4">
    <View className="flex-row gap-6">
      <Skeleton width={96} />
      <Skeleton width={64} />
    </View>
    {/* The chart's gridlines, at the real chart's height, with its three date labels below. */}
    <View className="h-52 justify-between pt-8.5 pb-6">
      {rows(5).map((i) => (
        <View key={i} className="border-t border-line" />
      ))}
    </View>
    <View className="-mt-4 flex-row justify-between">
      <Skeleton width={40} />
      <Skeleton width={40} />
      <Skeleton width={40} />
    </View>
  </View>
);

export const WorkStatusSkeleton = () => (
  <View className="gap-5">
    <View className="flex-row items-end gap-3">
      <Skeleton shape="input" width={72} />
      <Skeleton width={120} />
    </View>
    <Skeleton shape="bar" />
    <View className="flex-row flex-wrap gap-x-5 gap-y-3">
      {rows(5).map((i) => (
        <View key={i} className="flex-row items-center gap-2">
          <Skeleton shape="icon" width={12} />
          <Skeleton width={72} />
        </View>
      ))}
    </View>
  </View>
);
