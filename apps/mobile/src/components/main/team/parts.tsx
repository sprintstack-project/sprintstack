import { scaled } from '@lib/scale';
import { Text } from '@sprintstack/ui';
import { Minus, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { spanLabel, type TimeOff, type TimeOffType, TYPE_LABEL } from './data';

/** Chip fill and text, and the solid fill for a day square or legend dot. */
export const TONES: Record<TimeOffType, { chip: string; text: string; fill: string }> = {
  vacation: { chip: 'bg-brand-subtle', text: 'text-brand-ink', fill: 'bg-brand' },
  sick: { chip: 'bg-warning-subtle', text: 'text-warning-ink', fill: 'bg-warning' },
  half: { chip: 'bg-info-subtle', text: 'text-info-ink', fill: 'bg-info' },
  other: { chip: 'bg-review-subtle', text: 'text-review-ink', fill: 'bg-review' },
};

const STRIPES = [-50, -25, 0, 25, 50, 75, 100, 125, 150];

/** Diagonal stripes for public holidays; fills its parent, which needs `overflow-hidden`. */
export const Hatch = () => (
  <View aria-hidden className="absolute inset-0">
    {STRIPES.map((top) => (
      <View
        key={top}
        className="absolute h-px w-[200%] bg-line-strong"
        style={{ top: `${top}%`, left: '-50%', transform: [{ rotate: '-45deg' }] }}
      />
    ))}
  </View>
);

/** "22–23 Oct · Vacation"; pressable when it opens the entry. */
export const TimeOffChip = ({ entry, onPress }: { entry: TimeOff; onPress?: () => void }) => {
  const label = `${spanLabel(entry)} · ${TYPE_LABEL[entry.type]}`;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={onPress ? `${label}. Edit` : label}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={8}
      className={`h-7 justify-center self-start rounded-full px-3 active:opacity-70 ${TONES[entry.type].chip}`}
    >
      <Text className={`text-meta font-bold ${TONES[entry.type].text}`}>{label}</Text>
    </Pressable>
  );
};

const STEP = 0.5;

/** Available days, half a day at a time; one adjustable control for screen readers. */
export const DaysStepper = ({
  name,
  value,
  max,
  onStep,
}: {
  name: string;
  value: number;
  max: number;
  onStep: (by: number) => void;
}) => {
  const ink = useTokenColor('ink');
  const disabled = useTokenColor('ink-disabled');
  const canLower = value > 0;
  const canRaise = value < max;
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`${name}’s available days`}
      accessibilityValue={{ text: `${value} days` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === 'increment' && canRaise) onStep(STEP);
        if (nativeEvent.actionName === 'decrement' && canLower) onStep(-STEP);
      }}
      className="h-11 flex-row items-center rounded-full border-[1.5px] border-line-strong"
    >
      <Pressable
        disabled={!canLower}
        onPress={() => onStep(-STEP)}
        className="size-11 items-center justify-center rounded-full active:bg-surface-pressed"
      >
        <Minus aria-hidden size={scaled(20)} strokeWidth={2} color={canLower ? ink : disabled} />
      </Pressable>
      <Text className="w-12 text-center text-[1.0625rem] font-extrabold text-ink">
        {value.toFixed(1)}
      </Text>
      <Pressable
        disabled={!canRaise}
        onPress={() => onStep(STEP)}
        className="size-11 items-center justify-center rounded-full active:bg-surface-pressed"
      >
        <Plus aria-hidden size={scaled(20)} strokeWidth={2} color={canRaise ? ink : disabled} />
      </Pressable>
    </View>
  );
};
