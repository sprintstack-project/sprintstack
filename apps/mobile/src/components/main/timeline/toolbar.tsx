import { scaled, touchSlop } from '@lib/scale';
import { FilterSelect, Text } from '@sprintstack/ui';
import Select from '@ui/select/select';
import { Calendar, ChevronDown, Sparkles, Zap } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { TogglePill } from '../taskboard/toolbar';
import {
  findRange,
  type Level,
  RANGE_OPTIONS,
  rangeShort,
  type Scale,
  STATUS_OPTIONS,
  type StatusFilter,
} from './data';

const levels: { value: Level; label: string; icon: typeof Zap }[] = [
  { value: 'epics', label: 'Epics', icon: Zap },
  { value: 'features', label: 'Features', icon: Sparkles },
];

const scales: { value: Scale; label: string }[] = [
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'quarters', label: 'Quarters' },
  { value: 'years', label: 'Years' },
];

const LevelOption = ({
  label,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  icon: typeof Zap;
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

interface ToolbarProps {
  level: Level;
  onLevelChange: (level: Level) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  range: string;
  onRangeChange: (range: string) => void;
  scale: Scale;
  onScaleChange: (scale: Scale) => void;
}

export const Toolbar = ({
  level,
  onLevelChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
  scale,
  onScaleChange,
}: ToolbarProps) => {
  const muted = useTokenColor('ink-muted');
  return (
    <View className="gap-4">
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Show"
        className="flex-row rounded-full bg-surface-muted p-1"
      >
        {levels.map((option) => (
          <LevelOption
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={level === option.value}
            onPress={() => onLevelChange(option.value)}
          />
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-6"
        contentContainerClassName="gap-3 px-6"
      >
        <Select
          options={RANGE_OPTIONS}
          value={range}
          onValueChange={(next) => next && onRangeChange(next)}
          trigger={{
            label: 'Date range',
            hitSlop: touchSlop(48),
            className:
              'h-12 flex-row items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 active:bg-surface-pressed',
            children: (
              <>
                <Calendar aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
                <Text className="text-[1.0625rem] leading-5 font-bold text-ink">
                  {rangeShort(findRange(range))}
                </Text>
                <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
              </>
            ),
          }}
        />
        {scales.map((option) => (
          <TogglePill
            key={option.value}
            label={`Scale: ${option.label}`}
            pressed={scale === option.value}
            onPress={() => onScaleChange(option.value)}
          >
            {() => (
              <Text
                className={`text-[1.0625rem] leading-5 font-extrabold ${scale === option.value ? 'text-on-ink' : 'text-ink'}`}
              >
                {option.label}
              </Text>
            )}
          </TogglePill>
        ))}
        <FilterSelect<StatusFilter>
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onValueChange={(next) => onStatusChange(next ?? 'all')}
        />
      </ScrollView>
    </View>
  );
};
