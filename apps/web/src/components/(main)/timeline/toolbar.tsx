'use client';

import Button from '@ui/button';
import FilterSelect from '@ui/filter-select';
import Tabs from '@ui/tabs';
import type { TabsChoice } from '@ui/types';
import { Sparkles, Zap } from 'lucide-react';
import { type Level, type Range, type Scale, STATUS_OPTIONS, type StatusFilter } from './data';
import RangePicker from './range-picker';

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
  range: Range;
  onRangeChange: (range: Range) => void;
  scale: Scale;
  onScaleChange: (scale: Scale) => void;
  /** Brings today into view. */
  onToday: () => void;
  /** With nothing charted, there's nothing to filter or scroll to. */
  empty?: boolean;
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
  empty,
}: ToolbarProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <Tabs label="Show" choices={levels} value={level} onValueChange={onLevelChange} />
    {!empty && (
      <FilterSelect<StatusFilter>
        label="Status"
        options={STATUS_OPTIONS}
        value={status}
        onValueChange={(next) => onStatusChange(next ?? 'all')}
      />
    )}
    <RangePicker value={range} onValueChange={onRangeChange} />
    {!empty && (
      <Button variant="ghost" onClick={onToday}>
        Today
      </Button>
    )}
    <div className="xl:ml-auto">
      <Tabs label="Scale" choices={scales} value={scale} onValueChange={onScaleChange} />
    </div>
  </div>
);

export default Toolbar;
