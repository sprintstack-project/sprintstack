'use client';

import { Button } from '@ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import CapacityTable from './capacity-table';
import {
  ACTIVE_SPRINT,
  type Adjustments,
  adjustKey,
  draftOf,
  findSprint,
  loadsOf,
  ME,
  newDraft,
  overloadText,
  sprintDates,
  summaryOf,
  TIME_OFF,
  type TimeOff,
  type TimeOffDraft,
  type View,
} from './data';
import SummaryTiles from './summary-tiles';
import TimeOffDialog from './time-off-dialog';
import Toolbar from './toolbar';
import VacationsGrid from './vacations-grid';

const Team = () => {
  const [view, setView] = useState<View>('capacity');
  const [sprintId, setSprintId] = useState(ACTIVE_SPRINT);
  const [timeOff, setTimeOff] = useState(TIME_OFF);
  const [adjust, setAdjust] = useState<Adjustments>({});
  const [draft, setDraft] = useState<TimeOffDraft | null>(null);

  const sprint = findSprint(sprintId);
  const loads = loadsOf(sprint, timeOff, adjust);
  const summary = summaryOf(sprint, loads);

  const addFor = (member: string, start?: Date, end?: Date) =>
    setDraft(newDraft(member, start, end));

  const save = (entry: TimeOff) =>
    setTimeOff((all) =>
      all.some((e) => e.id === entry.id)
        ? all.map((e) => (e.id === entry.id ? entry : e))
        : [...all, entry],
    );

  const step = (member: string, by: number) =>
    setAdjust((all) => {
      const key = adjustKey(sprint, member);
      return { ...all, [key]: (all[key] ?? 0) + by };
    });

  const reset = (member: string) =>
    setAdjust((all) => {
      const { [adjustKey(sprint, member)]: _, ...rest } = all;
      return rest;
    });

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">
            {sprint.name} · {sprintDates(sprint)} · {summary.working} working days
          </p>
          <h1 className="headline text-7xl leading-none">Team</h1>
        </div>
        <Button variant="secondary" size="lg" icon={Mail}>
          Invite people
        </Button>
      </div>
      <Toolbar
        view={view}
        onViewChange={setView}
        sprint={sprint}
        onSprintChange={setSprintId}
        onAddTimeOff={() => addFor(ME)}
      />
      {view === 'capacity' ? (
        <>
          <SummaryTiles summary={summary} overload={overloadText(loads)} />
          <CapacityTable
            sprint={sprint}
            loads={loads}
            timeOff={timeOff}
            working={summary.working}
            onStep={step}
            adjusted={(member) => Boolean(adjust[adjustKey(sprint, member)])}
            onReset={reset}
            onAddTimeOff={(member) => addFor(member)}
          />
        </>
      ) : (
        <VacationsGrid
          sprint={sprint}
          timeOff={timeOff}
          onAdd={addFor}
          onEdit={(entry) => setDraft(draftOf(entry))}
        />
      )}
      <TimeOffDialog
        draft={draft}
        onClose={() => setDraft(null)}
        timeOff={timeOff}
        adjust={adjust}
        onSave={save}
        onRemove={(id) => setTimeOff((all) => all.filter((e) => e.id !== id))}
      />
    </div>
  );
};

export default Team;
