import { Button } from '@ui/button';
import { EmptyState } from '@ui/empty-state';
import { clsx } from 'clsx';
import { PlusIcon } from 'lucide-react';
import { Gridlines, labelWidth } from './chart';
import type { Column } from './data';

// Dashed outlines where the first epics' bars would go, stepping across the range.
const GHOSTS = [
  { left: 0.04, width: 0.18 },
  { left: 0.15, width: 0.23 },
  { left: 0.32, width: 0.16 },
];

const pct = (fraction: number) => `${fraction * 100}%`;

interface EmptyTimelineProps {
  /** The range's columns, so the empty chart keeps its month headings. */
  columns: Column[];
  onCreate?: () => void;
  onConvert?: () => void;
}

/** In place of the chart while the project has no epics. */
export const EmptyTimeline = ({ columns, onCreate, onConvert }: EmptyTimelineProps) => (
  <section
    aria-label="Timeline"
    className="overflow-hidden rounded-2xl border border-line bg-surface"
  >
    <div aria-hidden className="flex">
      <div className={clsx(labelWidth, 'border-r border-line')} />
      <div className="relative flex-1">
        <div className="relative h-20 border-b border-line">
          <Gridlines columns={columns} />
          {columns.map((c) => (
            <span
              key={c.label}
              className="headline absolute top-7 pl-4 text-[1.25rem] leading-none whitespace-nowrap text-ink"
              style={{ left: pct(c.left) }}
            >
              {c.label}
            </span>
          ))}
        </div>
        {GHOSTS.map((ghost) => (
          <div key={ghost.left} className="relative h-20 border-b border-line last:border-b-0">
            <span
              className="absolute top-1/2 h-11 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-line-strong"
              style={{ left: pct(ghost.left), width: pct(ghost.width) }}
            />
          </div>
        ))}
      </div>
    </div>
    <div className="border-t border-line py-6">
      <EmptyState
        art={false}
        eyebrow="Timeline"
        title="Nothing on the"
        highlight="roadmap yet"
        description="Epics group related work across sprints. Give one a start and end date and it appears here as a bar."
        actions={
          <>
            <Button variant="brand" size="lg" icon={PlusIcon} onClick={onCreate}>
              Create an epic
            </Button>
            <Button size="lg" onClick={onConvert}>
              Turn a story into an epic
            </Button>
          </>
        }
      />
    </div>
  </section>
);
