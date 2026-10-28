'use client';

import { FilterSelect } from '@ui/filter-select';
import { Search } from 'lucide-react';
import {
  STATUS_OPTIONS,
  type StatusFilter,
  TYPE_OPTIONS,
  type TypeFilter,
} from '../taskboard/data';
import { ASSIGNEE_OPTIONS, type Filters } from './data';

interface ToolbarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const Toolbar = ({ filters, onFiltersChange }: ToolbarProps) => {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="kbd-focus inline-flex h-12 w-full cursor-text items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-[1.0625rem] leading-5 text-ink font-stretch-semi-condensed transition-colors duration-120 focus-within:border-ink hover:bg-surface-hover sm:w-80 xl:w-104">
        <Search aria-hidden strokeWidth={2} className="size-5 shrink-0 text-ink-muted" />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Filter backlog"
          aria-label="Filter backlog"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-placeholder"
        />
      </label>
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
      <p className="ml-auto hidden text-meta text-ink-muted xl:block">
        Drag to reorder · rank decides sprint order
      </p>
    </div>
  );
};

export default Toolbar;
