'use client';

import { Button } from '@ui/button';
import { FilterSelect } from '@ui/filter-select';
import Select from '@ui/select/select';
import { clsx } from 'clsx';
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

interface Choice<V> {
  value: V;
  label: string;
  icon?: typeof Zap;
}

/** A row of buttons in a grey track, the pressed one filled with ink. */
export const Segmented = <V extends string>({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: Choice<V>[];
  value: V;
  onChange: (value: V) => void;
}) => (
  <fieldset
    aria-label={label}
    className="m-0 flex shrink-0 rounded-full border-0 bg-surface-muted p-1"
  >
    {choices.map(({ value: choice, label, icon: Icon }) => (
      <button
        key={choice}
        type="button"
        aria-pressed={value === choice}
        onClick={() => onChange(choice)}
        className={clsx(
          'kbd-focus inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[1.0625rem] leading-5 font-extrabold whitespace-nowrap font-stretch-condensed transition-colors duration-120',
          value === choice ? 'bg-ink text-on-ink' : 'text-ink hover:bg-surface-hover',
        )}
      >
        {Icon && <Icon aria-hidden strokeWidth={2} className="size-5" />}
        {label}
      </button>
    ))}
  </fieldset>
);

const levels: Choice<Level>[] = [
  { value: 'epics', label: 'Epics', icon: Zap },
  { value: 'features', label: 'Features', icon: Sparkles },
];

const scales: Choice<Scale>[] = [
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
    <Segmented label="Show" choices={levels} value={level} onChange={onLevelChange} />
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
      <Segmented label="Scale" choices={scales} value={scale} onChange={onScaleChange} />
    </div>
  </div>
);

export default Toolbar;
