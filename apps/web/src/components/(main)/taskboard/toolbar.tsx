'use client';

import { FilterSelect } from '@ui/filter-select';
import { clsx } from 'clsx';
import { List, Search, SquareKanban } from 'lucide-react';
import {
  type Filters,
  SPRINTS,
  STATUS_OPTIONS,
  type StatusFilter,
  TYPE_OPTIONS,
  type TypeFilter,
  type View,
} from './data';

const pill =
  'kbd-focus inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-[1.0625rem] leading-5 whitespace-nowrap text-ink font-stretch-semi-condensed transition-colors duration-120 hover:bg-surface-hover data-popup-open:border-ink';

const views: { value: View; label: string; icon: typeof List }[] = [
  { value: 'list', label: 'List', icon: List },
  { value: 'kanban', label: 'Kanban', icon: SquareKanban },
];

const ViewSwitch = ({ view, onChange }: { view: View; onChange: (view: View) => void }) => {
  return (
    <fieldset
      aria-label="View"
      className="m-0 flex shrink-0 rounded-full border-0 bg-surface-muted p-1"
    >
      {views.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={clsx(
            'kbd-focus inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[1.0625rem] leading-5 font-extrabold font-stretch-condensed transition-colors duration-120',
            view === value ? 'bg-ink text-on-ink' : 'text-ink hover:bg-surface-hover',
          )}
        >
          <Icon aria-hidden strokeWidth={2} className="size-5" />
          {label}
        </button>
      ))}
    </fieldset>
  );
};

interface ToolbarProps {
  sprint: string;
  onSprintChange: (sprint: string) => void;
  view: View;
  onViewChange: (view: View) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  /** Items the filters leave, shown on the status pill while it filters. */
  matching: number;
}

const Divider = () => <span aria-hidden className="hidden h-8 w-px bg-line-strong md:block" />;

const Toolbar = ({
  sprint,
  onSprintChange,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  matching,
}: ToolbarProps) => {
  const set = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Sprint"
          options={SPRINTS}
          value={sprint}
          onValueChange={(next) => next && onSprintChange(next)}
        />
        <ViewSwitch view={view} onChange={onViewChange} />
      </div>
      <Divider />
      <div className="flex flex-wrap items-center gap-3">
        <label className={clsx(pill, 'w-full cursor-text sm:w-72')}>
          <Search aria-hidden strokeWidth={2} className="size-5 shrink-0 text-ink-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder="Filter work items"
            aria-label="Filter work items"
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
          count={filters.status === 'all' ? undefined : matching}
        />
        <button
          type="button"
          aria-pressed={filters.mine}
          onClick={() => set({ mine: !filters.mine })}
          className={clsx(
            pill,
            'font-extrabold font-stretch-condensed aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-on-ink aria-pressed:hover:bg-ink',
          )}
        >
          Assigned to me
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
