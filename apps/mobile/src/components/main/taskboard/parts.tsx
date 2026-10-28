import { scaled } from '@lib/scale';
import { PRIORITY_LABEL } from '@lib/status';
import { Text } from '@sprintstack/ui';
import type { Priority } from '@ui/types';
import {
  Bookmark,
  Bug,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Equal,
  SquareCheck,
  UserRound,
} from 'lucide-react-native';
import { View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import type { ItemType, Person } from './data';

// The small pieces a work item is drawn with, shared by the list and the board.

const types = {
  bug: { icon: Bug, label: 'Bug', box: 'bg-danger', color: 'on-danger' },
  story: { icon: Bookmark, label: 'Story', box: 'bg-success-subtle', color: 'success-ink' },
  task: { icon: SquareCheck, label: 'Task', box: 'bg-info-subtle', color: 'info-ink' },
} satisfies Record<ItemType, unknown>;

export const TypeIcon = ({ type }: { type: ItemType }) => {
  const { icon: Icon, label, box, color } = types[type];
  const iconColor = useTokenColor(color);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      className={`size-7 items-center justify-center rounded-md ${box}`}
    >
      <Icon aria-hidden size={scaled(16)} strokeWidth={2} color={iconColor} />
    </View>
  );
};

const priorities: Record<Priority, typeof Equal> = {
  highest: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
  low: ChevronDown,
  lowest: ChevronsDown,
};

/** Compact cards show the arrow alone; the name stays available to screen readers. */
export const PriorityIcon = ({ level }: { level: Priority }) => {
  const urgent = level === 'highest' || level === 'high';
  const color = useTokenColor(urgent ? 'danger' : 'ink');
  const Icon = priorities[level];
  return (
    <View accessibilityRole="image" accessibilityLabel={`${PRIORITY_LABEL[level]} priority`}>
      <Icon aria-hidden size={scaled(20)} strokeWidth={2.5} color={color} />
    </View>
  );
};

export const Avatar = ({ person }: { person: Person | null }) => {
  const muted = useTokenColor('ink-muted');
  if (!person) {
    return (
      <View
        accessibilityRole="image"
        accessibilityLabel="Unassigned"
        className="size-9 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink-muted"
      >
        <UserRound aria-hidden size={scaled(18)} strokeWidth={2} color={muted} />
      </View>
    );
  }
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={person.name}
      className="size-9 items-center justify-center rounded-full bg-ink"
    >
      <Text className="text-[0.75rem] font-extrabold text-on-ink">{person.initials}</Text>
    </View>
  );
};

export const Points = ({ points }: { points: number }) => (
  <View
    accessibilityRole="image"
    accessibilityLabel={`${points} points`}
    className="size-9 items-center justify-center rounded-full border-[1.5px] border-ink-muted"
  >
    <Text className="text-meta font-bold text-ink">{points}</Text>
  </View>
);

export const Tag = ({ children }: { children: string }) => (
  <View className="h-7 justify-center rounded-full bg-surface-muted px-3">
    <Text className="text-meta font-semibold text-ink">{children}</Text>
  </View>
);
