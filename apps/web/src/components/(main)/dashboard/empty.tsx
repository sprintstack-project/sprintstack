import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { EmptyState } from '@ui/empty-state';
import { ChartNoAxesGantt, Check, ChevronRight, Clock, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { SETUP_STEPS } from './data';

// What a new project's dashboard shows before there's any work: the setup checklist and the import
// tile in place of the summary tiles, and an empty state in each widget.

const textLink = 'link kbd-focus rounded-xs text-[1rem] leading-5';

const SetupTile = () => {
  const done = SETUP_STEPS.filter((step) => step.done).length;
  return (
    <Card variant="tile" tone="ink">
      <div className="flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="headline text-[3.5rem] leading-[0.92]">
            Get set up
            <br />
            <em>in four steps</em>
          </h2>
          <p className="text-right">
            <span className="headline block text-headline tabular-nums">
              {done}
              <span className="opacity-60">/{SETUP_STEPS.length}</span>
            </span>
            <span className="text-meta font-semibold font-stretch-semi-condensed">done</span>
          </p>
        </div>
        <ol className="divide-y divide-on-ink/20 border-t border-on-ink/20">
          {SETUP_STEPS.map((step, i) =>
            step.done ? (
              <li key={step.label} className="flex items-center gap-4 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
                  <Check aria-hidden strokeWidth={2.5} className="size-5" />
                </span>
                <s className="text-body-strong opacity-60 font-stretch-semi-condensed">
                  {step.label}
                </s>
                <span className="sr-only">(done)</span>
              </li>
            ) : (
              <li key={step.label}>
                <Link
                  href={step.href}
                  className="kbd-focus flex items-center gap-4 rounded-xs py-4 hover:opacity-85"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-current text-meta font-extrabold tabular-nums">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-body-strong font-stretch-semi-condensed">
                    {step.label}
                  </span>
                  <ChevronRight aria-hidden strokeWidth={2.5} className="size-5" />
                </Link>
              </li>
            ),
          )}
        </ol>
      </div>
    </Card>
  );
};

const ImportTile = ({ onImport }: { onImport?: () => void }) => (
  <Card variant="tile" tone="muted">
    <div className="flex h-full flex-col gap-4">
      <span className="eyebrow text-current">Moving from another tool?</span>
      <h2 className="headline text-[3.5rem] leading-[0.92]">Bring your backlog with you</h2>
      <p className="text-body-strong text-ink-muted font-stretch-semi-condensed">
        Import issues, sprints and assignees from a CSV export. Nothing is overwritten.
      </p>
      <span className="flex-1" />
      <div>
        <Button onClick={onImport}>Import from CSV</Button>
      </div>
    </div>
  </Card>
);

/** Takes the summary tiles' place until the project has work in it. */
export const GetStarted = ({ onImport }: { onImport?: () => void }) => (
  <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
    <SetupTile />
    <ImportTile onImport={onImport} />
  </div>
);

export const NoNextItems = ({ onCreate }: { onCreate?: () => void }) => (
  <EmptyState
    variant="widget"
    icon={Check}
    title="Nothing assigned"
    description="Items assigned to you show up here, soonest due first."
    actions={
      <Button variant="link" onClick={onCreate}>
        Create a work item
      </Button>
    }
  />
);

export const NoActivity = () => (
  <EmptyState
    variant="widget"
    icon={Clock}
    title="All quiet"
    description="Changes, comments and status moves from your team appear here as they happen."
    actions={
      <Link href="/team" className={textLink}>
        Invite your team
      </Link>
    }
  />
);

export const NoBurndown = () => (
  <EmptyState
    variant="widget"
    icon={ChartNoAxesGantt}
    title="No active sprint"
    description="Start a sprint to track remaining points day by day."
    actions={
      <Link href="/backlog" className={textLink}>
        Plan a sprint
      </Link>
    }
  />
);

export const NoWorkStatus = () => (
  <EmptyState
    variant="widget"
    icon={ListTodo}
    title="No work items yet"
    description="Once there's work in a sprint you'll see how it splits across statuses."
  />
);
