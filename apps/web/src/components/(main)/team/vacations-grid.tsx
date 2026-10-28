'use client';

import { clsx } from 'clsx';
import { format, isSameDay, isWeekend } from 'date-fns';
import { useEffect, useState } from 'react';
import { Avatar } from '../taskboard/parts';
import {
  daysOff,
  entriesIn,
  holidayOn,
  MEMBERS,
  offLabel,
  type Sprint,
  spanLabel,
  sprintDays,
  TIME_OFF_TYPES,
  type TimeOff,
  TODAY,
  TYPE_LABEL,
} from './data';
import { hatch, TONES, TYPE_ICON } from './parts';

/** The member column stays put while the days scroll under it. */
const memberColumn = 'sticky left-0 z-30 border-r border-line bg-surface';

/** Weekends are shaded and holidays striped, in the header and every row. */
const dayShade = (day: Date) =>
  holidayOn(day) ? hatch : isWeekend(day) ? 'bg-surface-muted' : undefined;

/** One entry as a pill across its days; a press opens it for editing. */
const Bar = ({
  entry,
  days,
  onEdit,
}: {
  entry: TimeOff;
  days: Date[];
  onEdit: (entry: TimeOff) => void;
}) => {
  const from = Math.max(
    0,
    days.findIndex((d) => d >= entry.start),
  );
  const last = days.findLastIndex((d) => d <= entry.end);
  const Icon = entry.type === 'half' ? null : TYPE_ICON[entry.type];
  return (
    <button
      type="button"
      onClick={() => onEdit(entry)}
      aria-label={`${TYPE_LABEL[entry.type]}, ${spanLabel(entry)}. Edit`}
      title={`${TYPE_LABEL[entry.type]} · ${spanLabel(entry)}`}
      className={clsx(
        'kbd-focus relative z-20 row-start-1 mx-1 flex h-11 min-w-0 cursor-pointer items-center gap-2 self-center overflow-hidden rounded-xl border-[1.5px] border-l-4 px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap uppercase tracking-[.03em] font-stretch-condensed transition-[filter] duration-120 hover:brightness-110',
        TONES[entry.type].bar,
      )}
      style={{ gridColumn: `${from + 2} / ${last + 3}` }}
    >
      {Icon ? (
        <>
          <Icon aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
          <span className="truncate">{TYPE_LABEL[entry.type]}</span>
        </>
      ) : (
        <span className="text-[1rem]">½</span>
      )}
    </button>
  );
};

interface VacationsGridProps {
  sprint: Sprint;
  timeOff: TimeOff[];
  /** A day clicked, or a run of days dragged across, in one member's row. */
  onAdd: (member: string, start: Date, end: Date) => void;
  onEdit: (entry: TimeOff) => void;
}

const VacationsGrid = ({ sprint, timeOff, onAdd, onEdit }: VacationsGridProps) => {
  const days = sprintDays(sprint);
  const [drag, setDrag] = useState<{ member: string; from: number; to: number } | null>(null);
  const template = {
    gridTemplateColumns: `minmax(15rem, 20rem) repeat(${days.length}, minmax(3.5rem, 1fr))`,
  };
  const todayAt = days.findIndex((d) => isSameDay(d, TODAY));
  const holidays = days.flatMap((d, i) => {
    const holiday = holidayOn(d);
    return holiday && !isWeekend(d) ? [{ ...holiday, column: i }] : [];
  });

  // Letting go anywhere ends the drag, so a release outside the row still adds the days covered.
  useEffect(() => {
    if (!drag) return;
    const finish = () => {
      const [a, b] = [drag.from, drag.to].sort((x, y) => x - y);
      onAdd(drag.member, days[a], days[b]);
      setDrag(null);
    };
    const cancel = () => setDrag(null);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', cancel);
    };
  }, [drag, days, onAdd]);

  const dragged = (member: string, i: number) =>
    drag?.member === member &&
    i >= Math.min(drag.from, drag.to) &&
    i <= Math.max(drag.from, drag.to);

  return (
    <section
      aria-label="Vacations"
      className="overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="overflow-x-auto">
        <div className="relative w-max min-w-full select-none">
          <div className="grid border-b border-line-strong" style={template}>
            <div className={clsx(memberColumn, 'flex items-center px-6')}>
              <p className="eyebrow">Member</p>
            </div>
            {days.map((day, i) => (
              <div
                key={day.toISOString()}
                className={clsx(
                  'flex flex-col items-center gap-1 border-l border-line py-4',
                  dayShade(day),
                )}
              >
                <span className="eyebrow">{format(day, 'EEEEEE')}</span>
                <span
                  aria-current={i === todayAt ? 'date' : undefined}
                  className={clsx(
                    'grid size-9 place-items-center rounded-full font-display text-[1.25rem] leading-none font-extrabold tabular-nums font-stretch-condensed',
                    i === todayAt ? 'bg-ink text-on-ink' : 'text-ink',
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>
            ))}
          </div>

          <div className="relative">
            <ul aria-label="Time off by member">
              {MEMBERS.map((member) => (
                <li
                  key={member.id}
                  className="grid border-t border-line first:border-t-0"
                  style={template}
                >
                  <div
                    className={clsx(
                      memberColumn,
                      'col-start-1 row-start-1 flex items-center gap-3 px-6 py-5',
                    )}
                  >
                    <Avatar person={member} />
                    <div className="min-w-0">
                      <p className="truncate text-body-strong text-ink font-stretch-semi-condensed lg:text-[1.0625rem]">
                        {member.name}
                      </p>
                      <p className="truncate text-meta text-ink-muted font-stretch-semi-condensed">
                        {offLabel(daysOff(timeOff, member.id, sprint))}
                      </p>
                    </div>
                  </div>
                  {/* A pointer shortcut; keyboard users add time off with the button above. */}
                  {days.map((day, i) => (
                    <div
                      key={day.toISOString()}
                      aria-hidden
                      onPointerDown={(e) => {
                        if (e.button !== 0) return;
                        // Touch captures the pointer to the first cell; release it so others get pointerenter.
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setDrag({ member: member.id, from: i, to: i });
                      }}
                      onPointerEnter={() =>
                        drag?.member === member.id && setDrag({ ...drag, to: i })
                      }
                      className={clsx(
                        'row-start-1 cursor-pointer border-l border-line transition-colors duration-120',
                        dragged(member.id, i)
                          ? 'bg-brand-subtle'
                          : clsx(dayShade(day), 'hover:bg-surface-hover'),
                      )}
                      style={{ gridColumn: i + 2 }}
                    />
                  ))}
                  {entriesIn(timeOff, member.id, sprint).map((entry) => (
                    <Bar key={entry.id} entry={entry} days={days} onEdit={onEdit} />
                  ))}
                </li>
              ))}
            </ul>

            {/* Holiday names and today's line run down every row, over the days, under the bars. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 grid"
              style={template}
            >
              {holidays.map((h) => (
                <div
                  key={h.name}
                  className="row-start-1 flex items-center justify-center"
                  style={{ gridColumn: h.column + 2 }}
                >
                  <span className="rotate-180 rounded-sm bg-surface px-1 py-2 eyebrow [writing-mode:vertical-rl]">
                    {h.name}
                  </span>
                </div>
              ))}
              {todayAt !== -1 && (
                <div
                  className="row-start-1 flex justify-center"
                  style={{ gridColumn: todayAt + 2 }}
                >
                  <span className="w-0.5 bg-brand" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-6 py-4">
        <ul aria-label="Legend" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {TIME_OFF_TYPES.map((type) => (
            <li key={type} className="flex items-center gap-2 text-meta text-ink-muted">
              <span
                aria-hidden
                className={clsx('h-4 w-7 rounded-md border-[1.5px] border-l-4', TONES[type].swatch)}
              />
              {TYPE_LABEL[type]}
            </li>
          ))}
          <li className="flex items-center gap-2 text-meta text-ink-muted">
            <span aria-hidden className={clsx('h-4 w-7 rounded-md border border-line', hatch)} />
            Public holiday
          </li>
          <li className="flex items-center gap-2 text-meta text-ink-muted">
            <span aria-hidden className="h-4 w-7 rounded-md border border-line bg-surface-muted" />
            Weekend
          </li>
        </ul>
        <p className="text-meta text-ink-muted md:ml-auto">
          Click a day to add time off · drag to cover several
        </p>
      </div>
    </section>
  );
};

export default VacationsGrid;
