'use client';

import Button from '@ui/button';
import FilterSelect from '@ui/filter-select';
import { SelectWithTrigger as Select } from '@ui/select';
import Tabs from '@ui/tabs';
import type { TabsChoice } from '@ui/types';
import { Calendar, ChevronDown, Sparkles, Zap } from 'lucide-react';
import {
  findRange,
  type Level,
  RANGE_OPTIONS,
  rangeLabel,
  type Scale,
  STATUS_OPTIONS,
  type StatusFilter,
} from './data';

const levels: TabsChoice<Level>[] = [
  { value: 'epics', label: 'Epics', icon: Zap },
  { value: 'features', label: 'Features', icon: Sparkles },
];

const scales: TabsChoice<Scale>[] = [
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
  { value: 'quarters', label: 'Quarters' },
  { value: 'years', label: 'Years' },
];

interface ToolbarProps {
  level: Level;
  onLevelChange: (level: Level) => void;
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  range: string;
  onRangeChange: (range: string) => void;
  scale: Scale;
  onScaleChange: (scale: Scale) => void;
  /** Brings today into view. */
  onToday: () => void;
}

const Toolbar = ({
  level,
  onLevelChange,
  status,
  onStatusChange,
  range,
  onRangeChange,
  scale,
  onScaleChange,
  onToday,
}: ToolbarProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <Tabs label="Show" choices={levels} value={level} onValueChange={onLevelChange} />
    <FilterSelect<StatusFilter>
      label="Status"
      options={STATUS_OPTIONS}
      value={status}
      onValueChange={(next) => onStatusChange(next ?? 'all')}
    />
    <Select
      options={RANGE_OPTIONS}
      value={range}
      onValueChange={(next) => next && onRangeChange(next)}
      trigger={{
        label: 'Date range',
        align: 'start',
        className:
          'kbd-focus inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-[1.0625rem] leading-5 font-bold whitespace-nowrap text-ink font-stretch-semi-condensed transition-colors duration-120 hover:bg-surface-hover data-popup-open:border-ink',
        children: (
          <>
            <Calendar aria-hidden strokeWidth={2} className="size-5 shrink-0 text-ink-muted" />
            {rangeLabel(findRange(range))}
            <ChevronDown
              aria-hidden
              strokeWidth={2}
              className="size-5 shrink-0 text-ink-muted in-data-popup-open:rotate-180"
            />
          </>
        ),
      }}
    />
    <Button variant="ghost" onClick={onToday}>
      Today
    </Button>
    <div className="xl:ml-auto">
      <Tabs label="Scale" choices={scales} value={scale} onValueChange={onScaleChange} />
    </div>
  </div>
);

export default Toolbar;
