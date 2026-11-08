import Button from '@ui/button';
import EmptyState from '@ui/empty-state';
import { clsx } from 'clsx';
import { PlusIcon } from 'lucide-react';
import { Gridlines, labelWidth } from './chart';
import { type Column, MIN_COLUMN, type Scale } from './data';

// Dashed outlines where the first epics' bars would go, stepping across the range and fading out.
const GHOSTS = [
  { left: 0.06, width: 0.3, opacity: 1 },
  { left: 0.2, width: 0.38, opacity: 0.7 },
  { left: 0.44, width: 0.26, opacity: 0.4 },
];

const pct = (fraction: number) => `${fraction * 100}%`;

interface EmptyTimelineProps {
  /** The range's columns, so the empty chart keeps its month headings. */
  columns: Column[];
  scale: Scale;
  onCreate?: () => void;
  onConvert?: () => void;
}

/** In place of the chart while the project has no epics. */
export const EmptyTimeline = ({ columns, scale, onCreate, onConvert }: EmptyTimelineProps) => {
  const track = { minWidth: `${columns.length * MIN_COLUMN[scale]}rem` };

  return (
    <section
      aria-label="Timeline"
      className="overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div aria-hidden className="overflow-x-auto">
        <div className="w-max min-w-full">
          <div className="flex border-b border-line-strong">
            <div className={clsx(labelWidth, 'border-r border-line')} />
            <div className="relative h-16 flex-1" style={track}>
              <Gridlines columns={columns} />
              {columns.map((c) => (
                <span
                  key={c.label}
                  className="headline absolute top-1/2 -translate-y-1/2 pl-4 text-[1.25rem] leading-none whitespace-nowrap text-ink"
                  style={{ left: pct(c.left) }}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className={labelWidth} />
            <div className="flex-1" style={track}>
              {GHOSTS.map((ghost) => (
                <div key={ghost.left} className="relative h-19 last:border-b-0">
                  <span
                    className="absolute top-1/2 h-10 -translate-y-1/2 rounded-full border-[1.5px] border-dashed border-line-strong"
                    style={{
                      left: pct(ghost.left),
                      width: pct(ghost.width),
                      opacity: ghost.opacity,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 pb-5">
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
};
