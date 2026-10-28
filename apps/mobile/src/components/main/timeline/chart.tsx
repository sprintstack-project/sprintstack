import { scaled } from '@lib/scale';
import { STATUS_LABEL } from '@lib/status';
import { Text } from '@sprintstack/ui';
import { ChevronDown, Sparkles, Zap } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { Avatar } from '../taskboard/parts';
import {
  type Column,
  contains,
  datesOf,
  EPICS,
  type Epic,
  type Feature,
  type Level,
  offsetOf,
  PLAN_STATUSES,
  type PlanStatus,
  type Range,
  spanOf,
  TODAY,
} from './data';

const pct = (fraction: number) => `${fraction * 100}%` as const;

/** Outline, fill, the shaded part that's done, and the text, per status. */
const TONES: Record<PlanStatus, { bar: string; done: string; text: string }> = {
  neutral: { bar: 'border-line-strong bg-surface', done: 'bg-neutral-subtle', text: 'text-ink' },
  info: { bar: 'border-info bg-info-subtle', done: 'bg-info/30', text: 'text-info-ink' },
  review: { bar: 'border-review bg-review-subtle', done: 'bg-review/30', text: 'text-review-ink' },
  warning: {
    bar: 'border-warning bg-warning-subtle',
    done: 'bg-warning/30',
    text: 'text-warning-ink',
  },
  success: {
    bar: 'border-success bg-success-subtle',
    done: 'bg-success/30',
    text: 'text-success-ink',
  },
};

const kinds = {
  epic: { icon: Zap, label: 'Epic', box: 'bg-review-subtle', color: 'review-ink' },
  feature: { icon: Sparkles, label: 'Feature', box: 'bg-warning-subtle', color: 'warning-ink' },
};

const KindIcon = ({ kind, small }: { kind: keyof typeof kinds; small?: boolean }) => {
  const { icon: Icon, label, box, color } = kinds[kind];
  const iconColor = useTokenColor(color);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      className={`items-center justify-center rounded-lg ${small ? 'size-6' : 'size-8'} ${box}`}
    >
      <Icon aria-hidden size={scaled(small ? 14 : 18)} strokeWidth={2} color={iconColor} />
    </View>
  );
};

/** Centres its child on a point across the track, in a box wide enough for the today pill. */
const At = ({ left, children }: { left: number; children: ReactNode }) => (
  <View className="absolute inset-y-0 -ml-12 w-24 items-center" style={{ left: pct(left) }}>
    {children}
  </View>
);

/** The item's dates as a pill under its title, its done part shaded, over the column lines. */
const Track = ({
  item,
  range,
  columns,
  small,
}: {
  item: Epic | Feature;
  range: Range;
  columns: Column[];
  small?: boolean;
}) => {
  const span = spanOf(range, item);
  const tone = TONES[item.status];
  const today = contains(range, TODAY) ? offsetOf(range, TODAY) : null;
  return (
    <View className={`relative ${small ? 'h-7' : 'h-9'}`}>
      {columns
        .filter((c) => c.left > 0)
        .map((c) => (
          <View
            key={c.label}
            className="absolute inset-y-0 w-px bg-line"
            style={{ left: pct(c.left) }}
          />
        ))}
      {span && (
        <View
          accessibilityRole="image"
          accessibilityLabel={`${datesOf(item)}, ${STATUS_LABEL[item.status]}, ${item.progress}% done`}
          className={`absolute inset-y-0 min-w-14 flex-row items-center overflow-hidden border-[1.5px] ${span.before ? 'rounded-l-md' : 'rounded-l-full'} ${span.after ? 'rounded-r-md' : 'rounded-r-full'} ${tone.bar}`}
          style={{ left: pct(span.left), width: pct(span.width) }}
        >
          <View
            className={`absolute inset-y-0 left-0 ${tone.done}`}
            style={{ width: `${item.progress}%` }}
          />
          <Text className={`px-1.5 text-meta font-extrabold ${tone.text}`}>
            {span.before ? '←' : ''}
            {item.progress}%{span.after ? '→' : ''}
          </Text>
        </View>
      )}
      {/* Today's line crosses each track, over the bar, and leaves the titles clear. */}
      {today !== null && (
        <At left={today}>
          <View className="h-full w-0.5 bg-brand" />
        </At>
      )}
    </View>
  );
};

const EpicBlock = ({
  epic,
  range,
  columns,
  expanded,
  onExpandedChange,
}: {
  epic: Epic;
  range: Range;
  columns: Column[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) => {
  const ink = useTokenColor('ink');
  return (
    <View className="border-t border-line">
      <View className="gap-3 px-5 py-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${epic.key}, ${epic.title}`}
          accessibilityHint={`${expanded ? 'Hides' : 'Shows'} its features`}
          accessibilityState={{ expanded }}
          onPress={() => onExpandedChange(!expanded)}
          className="flex-row items-center gap-3"
        >
          <KindIcon kind="epic" />
          <View className="flex-1">
            <Text className="text-meta font-semibold text-ink-muted">
              {epic.key} · {datesOf(epic)}
            </Text>
            <Text numberOfLines={1} className="text-body-strong font-bold text-ink">
              {epic.title}
            </Text>
          </View>
          <Avatar person={epic.owner} />
          <View className={expanded ? undefined : '-rotate-90'}>
            <ChevronDown aria-hidden size={scaled(22)} strokeWidth={2} color={ink} />
          </View>
        </Pressable>
        <Track item={epic} range={range} columns={columns} />
      </View>
      {expanded && (
        <View className="gap-4 bg-surface-muted px-5 pt-1 pb-4">
          {epic.features.map((feature) => (
            <View key={feature.key} className="gap-2">
              <View className="flex-row items-center gap-2 pl-10">
                <KindIcon kind="feature" small />
                <Text numberOfLines={1} className="flex-1 text-body-strong font-bold text-ink">
                  {feature.title}
                </Text>
              </View>
              <Track item={feature} range={range} columns={columns} small />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const FeatureBlock = ({
  feature,
  range,
  columns,
}: {
  feature: Feature;
  range: Range;
  columns: Column[];
}) => {
  const epic = EPICS.find((e) => e.features.includes(feature));
  return (
    <View className="gap-3 border-t border-line px-5 py-4">
      <View className="flex-row items-center gap-3">
        <KindIcon kind="feature" />
        <View className="flex-1">
          <Text numberOfLines={1} className="text-meta font-semibold text-ink-muted">
            {epic?.key} · {datesOf(feature)}
          </Text>
          <Text numberOfLines={1} className="text-body-strong font-bold text-ink">
            {feature.title}
          </Text>
        </View>
      </View>
      <Track item={feature} range={range} columns={columns} />
    </View>
  );
};

interface ChartProps {
  level: Level;
  /** Epics mode: the epics the filter leaves. */
  epics: Epic[];
  /** Features mode: the features the filter leaves. */
  features: Feature[];
  range: Range;
  columns: Column[];
  expanded: string[];
  onExpandedChange: (key: string, expanded: boolean) => void;
}

export const Chart = ({
  level,
  epics,
  features,
  range,
  columns,
  expanded,
  onExpandedChange,
}: ChartProps) => {
  const today = contains(range, TODAY) ? offsetOf(range, TODAY) : null;
  const count = level === 'epics' ? epics.length : features.length;
  // A phone fits about six labels across; the rest keep their lines but go unnamed.
  const every = Math.ceil(columns.length / 6);

  return (
    <View className="overflow-hidden rounded-2xl border border-line bg-surface">
      <View className="px-5 pt-4">
        <View className="relative h-5">
          {columns.map((c, i) =>
            i % every === 0 ? (
              <Text
                key={c.label}
                className="absolute top-0 text-sm font-extrabold uppercase text-ink"
                style={{ left: pct(c.left) }}
              >
                {c.label}
              </Text>
            ) : null,
          )}
        </View>
        <View className="relative h-11">
          {today !== null && (
            <At left={today}>
              <View className="absolute top-4 bottom-0 w-0.5 bg-brand" />
              <View className="mt-1.5 rounded-full bg-brand px-2.5 py-1">
                <Text className="text-[0.8125rem] leading-4 font-extrabold uppercase text-on-brand">
                  Today
                </Text>
              </View>
            </At>
          )}
        </View>
      </View>
      <View>
        {count === 0 ? (
          <Text className="border-t border-line px-5 py-10 text-center text-body-strong font-bold text-ink-muted">
            No {level} match this status
          </Text>
        ) : level === 'epics' ? (
          epics.map((epic) => (
            <EpicBlock
              key={epic.key}
              epic={epic}
              range={range}
              columns={columns}
              expanded={expanded.includes(epic.key)}
              onExpandedChange={(next) => onExpandedChange(epic.key, next)}
            />
          ))
        ) : (
          features.map((feature) => (
            <FeatureBlock key={feature.key} feature={feature} range={range} columns={columns} />
          ))
        )}
      </View>
      <View className="flex-row flex-wrap gap-x-4 gap-y-2 border-t border-line px-5 py-4">
        {PLAN_STATUSES.map((status) => (
          <View key={status} className="flex-row items-center gap-2">
            <View className={`h-3.5 w-7 rounded-full border-[1.5px] ${TONES[status].bar}`} />
            <Text className="text-meta font-semibold text-ink-muted">{STATUS_LABEL[status]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
