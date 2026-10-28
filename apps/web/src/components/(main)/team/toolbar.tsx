'use client';

import { Button } from '@ui/button';
import Select from '@ui/select/select';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  UsersRound,
} from 'lucide-react';
import { Segmented } from '../timeline/toolbar';
import { SPRINT_OPTIONS, SPRINTS, type Sprint, sprintDates, type View } from './data';

const views = [
  { value: 'capacity' as const, label: 'Capacity', icon: UsersRound },
  { value: 'vacations' as const, label: 'Vacations', icon: CalendarDays },
];

const navButton =
  'kbd-focus grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 not-disabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-ink-disabled';

interface ToolbarProps {
  view: View;
  onViewChange: (view: View) => void;
  sprint: Sprint;
  onSprintChange: (sprint: string) => void;
  onAddTimeOff: () => void;
}

const Toolbar = ({ view, onViewChange, sprint, onSprintChange, onAddTimeOff }: ToolbarProps) => {
  const at = SPRINTS.indexOf(sprint);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Segmented label="View" choices={views} value={view} onChange={onViewChange} />
      <div className="flex items-center gap-1 sm:ml-3">
        <button
          type="button"
          aria-label="Previous sprint"
          disabled={at <= 0}
          onClick={() => onSprintChange(SPRINTS[at - 1].id)}
          className={navButton}
        >
          <ChevronLeft aria-hidden strokeWidth={2} className="size-6" />
        </button>
        <Select
          options={SPRINT_OPTIONS}
          value={sprint.id}
          onValueChange={(next) => next && onSprintChange(next)}
          trigger={{
            label: 'Sprint',
            align: 'start',
            className:
              'kbd-focus inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-line-strong px-5 text-[1.0625rem] leading-5 font-bold whitespace-nowrap text-ink font-stretch-semi-condensed transition-colors duration-120 hover:bg-surface-hover data-popup-open:border-ink',
            children: (
              <>
                {sprint.name} · {sprintDates(sprint)}
                <ChevronDown
                  aria-hidden
                  strokeWidth={2}
                  className="size-5 shrink-0 text-ink-muted in-data-popup-open:rotate-180"
                />
              </>
            ),
          }}
        />
        <button
          type="button"
          aria-label="Next sprint"
          disabled={at >= SPRINTS.length - 1}
          onClick={() => onSprintChange(SPRINTS[at + 1].id)}
          className={navButton}
        >
          <ChevronRight aria-hidden strokeWidth={2} className="size-6" />
        </button>
      </div>
      {view === 'vacations' && (
        <div className="flex flex-wrap gap-3 xl:ml-auto">
          <Button variant="secondary" icon={Pencil}>
            Edit public holidays
          </Button>
          <Button variant="brand" icon={Plus} onClick={onAddTimeOff}>
            Add time off
          </Button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
