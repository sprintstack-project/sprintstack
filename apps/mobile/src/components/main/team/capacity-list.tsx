import { Text } from '@sprintstack/ui';
import { View } from 'react-native';
import { Avatar } from '../taskboard/parts';
import {
  entriesIn,
  formatDays,
  type MemberLoad,
  type Sprint,
  type summaryOf,
  type TimeOff,
} from './data';
import { DaysStepper, TimeOffChip } from './parts';

/** Days available and points committed, side by side. */
const Tiles = ({ summary }: { summary: ReturnType<typeof summaryOf> }) => {
  const over = summary.committed - summary.capacity;
  return (
    <View className="flex-row gap-3">
      <View className="flex-1 gap-1 rounded-2xl bg-ink p-5">
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase text-on-ink">
          Available
        </Text>
        <Text className="text-[2.75rem] leading-[3rem] font-extrabold text-on-ink">
          {formatDays(summary.available)}
        </Text>
        <Text className="text-meta font-semibold text-on-ink">of {summary.total} days</Text>
      </View>
      <View
        className={`flex-1 gap-1 rounded-2xl border-2 bg-surface p-5 ${over > 0 ? 'border-danger' : 'border-line'}`}
      >
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase text-ink-muted">
          Committed
        </Text>
        <Text className="text-[2.75rem] leading-[3rem] font-extrabold text-ink">
          {summary.committed}
          <Text className="text-[1.75rem] leading-[3rem] font-extrabold text-ink-muted">
            /{summary.capacity}
          </Text>
        </Text>
        <Text className={`text-meta font-bold ${over > 0 ? 'text-danger' : 'text-ink-muted'}`}>
          {over > 0 ? `Over by ${over} pts` : over === 0 ? 'Full' : `${-over} pts free`}
        </Text>
      </View>
    </View>
  );
};

/** Points assigned against capacity; the part over capacity turns red. */
const Load = ({ load }: { load: MemberLoad }) => {
  const { assigned, capacity } = load;
  if (capacity === null) {
    return <Text className="text-meta font-semibold text-ink-muted">Doesn’t take points</Text>;
  }
  const over = assigned - capacity;
  const scale = Math.max(assigned, capacity) || 1;
  const status = over > 0 ? `Over by ${over}` : over === 0 ? 'Full' : `${-over} pts free`;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Points"
      accessibilityValue={{ text: `${assigned} of ${capacity} points, ${status.toLowerCase()}` }}
      className="gap-2"
    >
      <View className="flex-row items-baseline justify-between">
        <Text className="text-meta font-semibold text-ink-muted">
          <Text className="text-body-strong font-bold text-ink">{assigned}</Text> / {capacity} pts
        </Text>
        <Text
          className={`text-meta ${over > 0 ? 'font-extrabold text-danger' : 'font-bold text-ink'}`}
        >
          {status}
        </Text>
      </View>
      <View className="h-2 flex-row overflow-hidden rounded-full bg-line">
        <View
          className="bg-ink"
          style={{ width: `${(Math.min(assigned, capacity) / scale) * 100}%` }}
        />
        {over > 0 && <View className="bg-danger" style={{ width: `${(over / scale) * 100}%` }} />}
      </View>
    </View>
  );
};

interface CapacityListProps {
  sprint: Sprint;
  summary: ReturnType<typeof summaryOf>;
  loads: MemberLoad[];
  timeOff: TimeOff[];
  onStep: (member: string, by: number) => void;
  onEdit: (entry: TimeOff) => void;
}

export const CapacityList = ({
  sprint,
  summary,
  loads,
  timeOff,
  onStep,
  onEdit,
}: CapacityListProps) => (
  <>
    <Tiles summary={summary} />
    <View className="rounded-2xl border border-line bg-surface px-5">
      {loads.map((load, i) => {
        const { member } = load;
        const entries = entriesIn(timeOff, member.id, sprint);
        return (
          <View key={member.id} className={`gap-3 py-5 ${i > 0 ? 'border-t border-line' : ''}`}>
            <View className="flex-row items-center gap-3">
              <Avatar person={member} />
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="text-body-strong font-bold text-ink">
                  {member.name}
                </Text>
                <Text numberOfLines={1} className="text-meta font-semibold text-ink-muted">
                  {member.role}
                </Text>
              </View>
              <DaysStepper
                name={member.name}
                value={load.available}
                max={summary.working}
                onStep={(by) => onStep(member.id, by)}
              />
            </View>
            {entries.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {entries.map((entry) => (
                  <TimeOffChip key={entry.id} entry={entry} onPress={() => onEdit(entry)} />
                ))}
              </View>
            )}
            <Load load={load} />
          </View>
        );
      })}
      <Text className="border-t border-line py-4 text-meta font-semibold text-ink-muted">
        {summary.working} working days − time off. 1 point per available day.
      </Text>
    </View>
  </>
);
