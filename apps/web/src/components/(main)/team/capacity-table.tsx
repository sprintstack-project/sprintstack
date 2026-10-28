'use client';

import Select from '@ui/select/select';
import { clsx } from 'clsx';
import { CalendarPlus, Ellipsis, Minus, Plus, RotateCcw } from 'lucide-react';
import { Avatar } from '../taskboard/parts';
import { entriesIn, type Member, type MemberLoad, type Sprint, type TimeOff } from './data';
import { TimeOffChip } from './parts';

const STEP = 0.5;

const stepButton =
  'kbd-focus grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 not-disabled:hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-ink-disabled';

/** Available days, half a day at a time. */
const DaysStepper = ({
  member,
  value,
  max,
  onStep,
}: {
  member: Member;
  value: number;
  max: number;
  onStep: (by: number) => void;
}) => (
  <fieldset
    aria-label={`${member.name}’s available days`}
    className="m-0 inline-flex h-12 items-center rounded-full border-[1.5px] border-line-strong p-0"
  >
    <button
      type="button"
      aria-label="Half a day less"
      disabled={value <= 0}
      onClick={() => onStep(-STEP)}
      className={stepButton}
    >
      <Minus aria-hidden strokeWidth={2} className="size-5" />
    </button>
    <output
      aria-live="polite"
      className="w-14 text-center text-[1.125rem] leading-6 font-extrabold text-ink tabular-nums font-stretch-semi-condensed"
    >
      {value.toFixed(1)}
    </output>
    <button
      type="button"
      aria-label="Half a day more"
      disabled={value >= max}
      onClick={() => onStep(STEP)}
      className={stepButton}
    >
      <Plus aria-hidden strokeWidth={2} className="size-5" />
    </button>
  </fieldset>
);

/** Points assigned against capacity; the part over capacity turns red. */
const Load = ({ load }: { load: MemberLoad }) => {
  const { assigned, capacity, member } = load;
  if (capacity === null) {
    return (
      <p className="text-meta text-ink-muted font-stretch-semi-condensed">Doesn’t take points</p>
    );
  }
  const over = assigned - capacity;
  const scale = Math.max(assigned, capacity) || 1;
  const status = over > 0 ? `Over by ${over}` : over === 0 ? 'Full' : `${-over} pts free`;
  return (
    <div className="flex w-64 flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 text-meta font-stretch-semi-condensed">
        <span className="text-ink-muted tabular-nums">
          <span className="text-body-strong text-ink">{assigned}</span> / {capacity} pts
        </span>
        <span className={over > 0 ? 'font-extrabold text-danger' : 'font-bold text-ink'}>
          {status}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${member.name}’s points`}
        aria-valuenow={assigned}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuetext={`${assigned} of ${capacity} points, ${status.toLowerCase()}`}
        className="flex h-2 overflow-hidden rounded-full bg-line"
      >
        <span
          className="bg-ink"
          style={{ width: `${(Math.min(assigned, capacity) / scale) * 100}%` }}
        />
        {over > 0 && <span className="bg-danger" style={{ width: `${(over / scale) * 100}%` }} />}
      </div>
    </div>
  );
};

interface CapacityTableProps {
  sprint: Sprint;
  loads: MemberLoad[];
  timeOff: TimeOff[];
  working: number;
  onStep: (member: string, by: number) => void;
  /** Whether the member's days were changed by hand, so they can be reset. */
  adjusted: (member: string) => boolean;
  onReset: (member: string) => void;
  onAddTimeOff: (member: string) => void;
}

const cell = 'px-6 py-5 align-middle';
const head = 'eyebrow px-6 py-5 text-left';

const CapacityTable = ({
  sprint,
  loads,
  timeOff,
  working,
  onStep,
  adjusted,
  onReset,
  onAddTimeOff,
}: CapacityTableProps) => (
  <section
    aria-label="Capacity"
    className="overflow-hidden rounded-2xl border border-line bg-surface"
  >
    <div className="overflow-x-auto">
      <table className="w-full min-w-[60rem] border-collapse">
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" className={head}>
              Member
            </th>
            <th scope="col" className={head}>
              Time off
            </th>
            <th scope="col" className={head}>
              Available days
            </th>
            <th scope="col" className={head}>
              Assigned vs capacity
            </th>
            <th scope="col" className="w-20">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loads.map((load) => {
            const { member } = load;
            const entries = entriesIn(timeOff, member.id, sprint);
            return (
              <tr key={member.id} className="border-t border-line first:border-t-0">
                <th scope="row" className={clsx(cell, 'text-left font-normal')}>
                  <div className="flex items-center gap-3">
                    <Avatar person={member} />
                    <div className="min-w-0">
                      <p className="truncate text-body-strong text-ink font-stretch-semi-condensed lg:text-[1.0625rem]">
                        {member.name}
                      </p>
                      <p className="truncate text-meta text-ink-muted font-stretch-semi-condensed">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </th>
                <td className={cell}>
                  {entries.length === 0 ? (
                    <span className="text-ink-muted">
                      <span aria-hidden>—</span>
                      <span className="sr-only">None</span>
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {entries.map((entry) => (
                        <TimeOffChip key={entry.id} entry={entry} />
                      ))}
                    </div>
                  )}
                </td>
                <td className={cell}>
                  <DaysStepper
                    member={member}
                    value={load.available}
                    max={working}
                    onStep={(by) => onStep(member.id, by)}
                  />
                </td>
                <td className={cell}>
                  <Load load={load} />
                </td>
                <td className={clsx(cell, 'text-right')}>
                  <Select
                    value={null}
                    options={[
                      {
                        value: 'time-off',
                        label: 'Add time off',
                        icon: CalendarPlus,
                        action: () => onAddTimeOff(member.id),
                      },
                      {
                        value: 'reset',
                        label: 'Reset available days',
                        icon: RotateCcw,
                        disabled: !adjusted(member.id),
                        action: () => onReset(member.id),
                      },
                    ]}
                    trigger={{
                      label: `More for ${member.name}`,
                      align: 'end',
                      className:
                        'kbd-focus inline-grid size-11 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 hover:bg-surface-hover data-popup-open:bg-surface-hover',
                      children: <Ellipsis aria-hidden strokeWidth={2} className="size-6" />,
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <p className="border-t border-line px-6 py-5 text-meta text-ink-muted font-stretch-semi-condensed">
      Available days = {working} working days − time off. Lower it for meetings, support rota or
      part-time. Capacity assumes 1 point per available day for people who estimate.
    </p>
  </section>
);

export default CapacityTable;
