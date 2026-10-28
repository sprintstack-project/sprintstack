import { scaled, touchSlop } from '@lib/scale';
import { Text } from '@sprintstack/ui';
import Select from '@ui/select/select';
import { CalendarDays, ChevronDown, Pencil, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { CapacityList } from './capacity-list';
import {
  ACTIVE_SPRINT,
  type Adjustments,
  adjustKey,
  draftOf,
  findSprint,
  loadsOf,
  newDraft,
  SPRINT_OPTIONS,
  summaryOf,
  type View as TeamView,
  type TimeOff,
  type TimeOffDraft,
} from './data';
import { TimeOffSheet } from './time-off-sheet';
import { VacationsList } from './vacations-list';

const views = [
  { value: 'capacity' as const, label: 'Capacity', icon: UsersRound },
  { value: 'vacations' as const, label: 'Vacations', icon: CalendarDays },
];

const ViewOption = ({
  label,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  icon: typeof UsersRound;
  selected: boolean;
  onPress: () => void;
}) => {
  const color = useTokenColor(selected ? 'on-ink' : 'ink');
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className={`h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full ${selected ? 'bg-ink' : 'active:bg-surface-pressed'}`}
    >
      <Icon aria-hidden size={scaled(20)} strokeWidth={2} color={color} />
      <Text
        className={`text-[1.0625rem] leading-5 font-extrabold ${selected ? 'text-on-ink' : 'text-ink'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const pill =
  'h-12 flex-row items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 active:bg-surface-pressed';

interface TeamProps {
  timeOff: TimeOff[];
  onTimeOffChange: (timeOff: TimeOff[]) => void;
  /** The time off being added or edited; the page's floating button opens a new one. */
  draft: TimeOffDraft | null;
  onDraftChange: (draft: TimeOffDraft | null) => void;
}

export const Team = ({ timeOff, onTimeOffChange, draft, onDraftChange }: TeamProps) => {
  const [view, setView] = useState<TeamView>('capacity');
  const [sprintId, setSprintId] = useState(ACTIVE_SPRINT);
  const [adjust, setAdjust] = useState<Adjustments>({});
  const muted = useTokenColor('ink-muted');

  const sprint = findSprint(sprintId);
  const loads = loadsOf(sprint, timeOff, adjust);
  const summary = summaryOf(sprint, loads);

  const step = (member: string, by: number) =>
    setAdjust((all) => {
      const key = adjustKey(sprint, member);
      return { ...all, [key]: (all[key] ?? 0) + by };
    });

  const save = (entry: TimeOff) =>
    onTimeOffChange(
      timeOff.some((e) => e.id === entry.id)
        ? timeOff.map((e) => (e.id === entry.id ? entry : e))
        : [...timeOff, entry],
    );

  return (
    <>
      <View>
        <Text className="text-sm font-bold uppercase text-ink-muted">
          {sprint.name} · {summary.working} working days
        </Text>
        <Text
          accessibilityRole="header"
          className="text-4xl leading-14 font-extrabold uppercase text-ink"
        >
          Team
        </Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="View"
        className="flex-row rounded-full bg-surface-muted p-1"
      >
        {views.map((option) => (
          <ViewOption
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={view === option.value}
            onPress={() => setView(option.value)}
          />
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-6"
        contentContainerClassName="gap-3 px-6"
      >
        {view === 'vacations' && (
          <Pressable accessibilityRole="button" hitSlop={touchSlop(48)} className={pill}>
            <Pencil aria-hidden size={scaled(18)} strokeWidth={2} color={muted} />
            <Text className="text-[1.0625rem] leading-5 font-bold text-ink">Public holidays</Text>
          </Pressable>
        )}
        <Select
          options={SPRINT_OPTIONS}
          value={sprint.id}
          onValueChange={(next) => next && setSprintId(next)}
          trigger={{
            label: 'Sprint',
            hitSlop: touchSlop(48),
            className: pill,
            children: (
              <>
                <CalendarDays aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
                <Text className="text-[1.0625rem] leading-5 font-bold text-ink">{sprint.name}</Text>
                <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
              </>
            ),
          }}
        />
      </ScrollView>
      {view === 'capacity' ? (
        <CapacityList
          sprint={sprint}
          summary={summary}
          loads={loads}
          timeOff={timeOff}
          onStep={step}
          onEdit={(entry) => onDraftChange(draftOf(entry))}
        />
      ) : (
        <VacationsList
          sprint={sprint}
          timeOff={timeOff}
          onAdd={(member) => onDraftChange(newDraft(member))}
          onEdit={(entry) => onDraftChange(draftOf(entry))}
        />
      )}
      <TimeOffSheet
        draft={draft}
        onClose={() => onDraftChange(null)}
        timeOff={timeOff}
        adjust={adjust}
        onSave={save}
        onRemove={(id) => onTimeOffChange(timeOff.filter((e) => e.id !== id))}
      />
    </>
  );
};
