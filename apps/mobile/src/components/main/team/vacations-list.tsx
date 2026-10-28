import { Text } from '@sprintstack/ui';
import { format, isSameDay, isWeekend, isWithinInterval } from 'date-fns';
import { Pressable, View } from 'react-native';
import { Avatar } from '../taskboard/parts';
import {
  daysOff,
  entriesIn,
  formatDays,
  HOLIDAYS,
  holidayOn,
  MEMBERS,
  type Sprint,
  sprintDays,
  TIME_OFF_TYPES,
  type TimeOff,
  TODAY,
  TYPE_LABEL,
} from './data';
import { Hatch, TimeOffChip, TONES } from './parts';

/** One day of one member: their time off in colour, today in ink, holidays striped. */
const DaySquare = ({ day, entries }: { day: Date; entries: TimeOff[] }) => {
  const entry = entries.find((e) => isWithinInterval(day, { start: e.start, end: e.end }));
  const holiday = holidayOn(day) && !isWeekend(day);
  const fill = holiday
    ? 'bg-surface-muted'
    : entry && !isWeekend(day)
      ? TONES[entry.type].fill
      : isSameDay(day, TODAY)
        ? 'bg-ink'
        : isWeekend(day)
          ? 'border border-line'
          : 'bg-surface-muted';
  return (
    <View className={`aspect-square flex-1 overflow-hidden rounded-md ${fill}`}>
      {holiday && <Hatch />}
    </View>
  );
};

interface VacationsListProps {
  sprint: Sprint;
  timeOff: TimeOff[];
  onAdd: (member: string) => void;
  onEdit: (entry: TimeOff) => void;
}

export const VacationsList = ({ sprint, timeOff, onAdd, onEdit }: VacationsListProps) => {
  const days = sprintDays(sprint);
  const holidays = HOLIDAYS.filter((h) => days.some((d) => isSameDay(d, h.date)));
  return (
    <View className="rounded-2xl border border-line bg-surface px-4">
      <View aria-hidden className="flex-row gap-1 border-b border-line py-3">
        {days.map((day) => {
          const today = isSameDay(day, TODAY);
          return (
            <View key={day.toISOString()} className="flex-1 items-center">
              <Text
                className={`text-[0.625rem] leading-3 font-extrabold uppercase ${today ? 'text-ink' : 'text-ink-muted'}`}
              >
                {format(day, 'EEEEE')}
              </Text>
              <Text
                className={`text-[0.625rem] leading-3 font-extrabold ${today ? 'text-ink' : 'text-ink-muted'}`}
              >
                {format(day, 'd')}
              </Text>
            </View>
          );
        })}
      </View>

      {MEMBERS.map((member) => {
        const entries = entriesIn(timeOff, member.id, sprint);
        const off = daysOff(timeOff, member.id, sprint);
        const summary = off === 0 ? 'Here all sprint' : `${formatDays(off)} off`;
        return (
          <Pressable
            key={member.id}
            accessibilityRole="button"
            accessibilityLabel={`${member.name}, ${off === 0 ? 'here all sprint' : `${formatDays(off)} days off`}`}
            accessibilityHint="Adds time off"
            onPress={() => onAdd(member.id)}
            className="gap-3 border-b border-line py-4 active:opacity-80"
          >
            <View className="flex-row items-center gap-3">
              <Avatar person={member} />
              <Text
                numberOfLines={1}
                className="min-w-0 flex-1 text-body-strong font-bold text-ink"
              >
                {member.name}
              </Text>
              <Text className="text-meta font-semibold text-ink-muted">{summary}</Text>
            </View>
            <View className="flex-row gap-1">
              {days.map((day) => (
                <DaySquare key={day.toISOString()} day={day} entries={entries} />
              ))}
            </View>
            {entries.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {entries.map((entry) => (
                  <TimeOffChip key={entry.id} entry={entry} onPress={() => onEdit(entry)} />
                ))}
              </View>
            )}
          </Pressable>
        );
      })}

      <View className="gap-2 py-4">
        <View className="flex-row flex-wrap gap-x-4 gap-y-2">
          {TIME_OFF_TYPES.map((type) => (
            <View key={type} className="flex-row items-center gap-1.5">
              <View className={`size-3 rounded-sm ${TONES[type].fill}`} />
              <Text className="text-meta font-semibold text-ink-muted">{TYPE_LABEL[type]}</Text>
            </View>
          ))}
        </View>
        {holidays.map((h) => (
          <View key={h.name} className="flex-row items-center gap-1.5">
            <View className="size-3 overflow-hidden rounded-sm bg-surface-muted">
              <Hatch />
            </View>
            <Text className="text-meta font-semibold text-ink-muted">
              {h.name} {format(h.date, 'd MMM')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
