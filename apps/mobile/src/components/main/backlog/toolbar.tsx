import { scaled } from '@lib/scale';
import { FilterSelect, Input } from '@sprintstack/ui';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  STATUS_OPTIONS,
  type StatusFilter,
  TYPE_OPTIONS,
  type TypeFilter,
} from '../taskboard/data';
import { TogglePill } from '../taskboard/toolbar';
import { ASSIGNEE_OPTIONS, type Filters } from './data';

interface ToolbarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export const Toolbar = ({ filters, onFiltersChange }: ToolbarProps) => {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });
  // The search pill shows the text filter; hiding it clears it, so nothing filters out of sight.
  const [searching, setSearching] = useState(filters.query !== '');

  return (
    <View className="gap-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="-mx-6"
        contentContainerClassName="gap-3 px-6"
      >
        <TogglePill
          label="Filter backlog"
          pressed={searching}
          onPress={() => {
            if (searching) set({ query: '' });
            setSearching(!searching);
          }}
        >
          {(color) => <Search aria-hidden size={scaled(22)} strokeWidth={2} color={color} />}
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
        />
        <FilterSelect
          label="Assignee"
          options={ASSIGNEE_OPTIONS}
          value={filters.assignee}
          onValueChange={(assignee) => set({ assignee: assignee ?? 'anyone' })}
        />
      </ScrollView>
      {searching && (
        <Input
          pill
          type="search"
          value={filters.query}
          onChange={(query) => set({ query })}
          placeholder="Filter backlog"
          slots={{ left: <Search aria-hidden size={scaled(20)} strokeWidth={2} /> }}
        />
      )}
    </View>
  );
};
