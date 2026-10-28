import { scaled, touchSlop } from '@lib/scale';
import { FilterSelect, Input, Text } from '@sprintstack/ui';
import { Funnel, List, Search, SquareKanban } from 'lucide-react-native';
import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import {
  type Filters,
  SPRINTS,
  STATUS_OPTIONS,
  type StatusFilter,
  TYPE_OPTIONS,
  type TypeFilter,
  type View as ViewMode,
} from './data';

const views: { value: ViewMode; label: string; icon: typeof List }[] = [
  { value: 'list', label: 'List', icon: List },
  { value: 'kanban', label: 'Kanban', icon: SquareKanban },
];

const ViewOption = ({
  label,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  icon: typeof List;
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

/** An outlined pill that fills with ink while on, the same height as FilterSelect. */
export const TogglePill = ({
  pressed,
  onPress,
  label,
  children,
}: {
  pressed: boolean;
  onPress: () => void;
  label: string;
  children: (color: string) => ReactNode;
}) => {
  const color = useTokenColor(pressed ? 'on-ink' : 'ink');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: pressed }}
      onPress={onPress}
      hitSlop={touchSlop(48)}
      className={`h-12 min-w-12 flex-row items-center justify-center rounded-full border-[1.5px] px-4 ${pressed ? 'border-ink bg-ink' : 'border-line-strong active:bg-surface-pressed'}`}
    >
      {children(color)}
    </Pressable>
  );
};

interface ToolbarProps {
  sprint: string;
  onSprintChange: (sprint: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  /** Items the filters leave, shown on the status pill while it filters. */
  matching: number;
}

export const Toolbar = ({
  sprint,
  onSprintChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  matching,
}: ToolbarProps) => {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });
  // The funnel shows the text filter; hiding it clears it, so nothing filters out of sight.
  const [searching, setSearching] = useState(filters.query !== '');

  return (
    <View className="gap-4">
      <FilterSelect
        block
        label="Sprint"
        options={SPRINTS}
        value={sprint}
        onValueChange={(next) => next && onSprintChange(next)}
      />
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
            onPress={() => onViewChange(option.value)}
          />
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="-mx-6"
        contentContainerClassName="gap-3 px-6"
      >
        <TogglePill
          label="Filter work items"
          pressed={searching}
          onPress={() => {
            if (searching) set({ query: '' });
            setSearching(!searching);
          }}
        >
          {(color) => <Funnel aria-hidden size={scaled(22)} strokeWidth={2} color={color} />}
        </TogglePill>
        <TogglePill
          label="Assigned to me"
          pressed={filters.mine}
          onPress={() => set({ mine: !filters.mine })}
        >
          {() => (
            <Text
              className={`text-[1.0625rem] leading-5 font-extrabold ${filters.mine ? 'text-on-ink' : 'text-ink'}`}
            >
              Assigned to me
            </Text>
          )}
        </TogglePill>
        <FilterSelect<TypeFilter>
          label="Type"
          options={TYPE_OPTIONS}
          value={filters.type}
          onValueChange={(type) => set({ type: type ?? 'all' })}
        />
        <FilterSelect<StatusFilter>
          label="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onValueChange={(status) => set({ status: status ?? 'all' })}
          count={filters.status === 'all' ? undefined : matching}
        />
      </ScrollView>
      {searching && (
        <Input
          pill
          type="search"
          value={filters.query}
          onChange={(query) => set({ query })}
          placeholder="Filter work items"
          slots={{ left: <Search aria-hidden size={scaled(20)} strokeWidth={2} /> }}
        />
      )}
    </View>
  );
};
