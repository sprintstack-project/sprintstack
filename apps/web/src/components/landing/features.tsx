import { Badge } from '@sprintstack/ui';
import {
  AlignLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  type LucideIcon,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';

const values = [
  {
    title: 'One place for every team',
    body: 'Product, design and engineering share one backlog, so nobody asks where the latest version lives.',
  },
  {
    title: 'Fast enough to stay out of the way',
    body: 'Create, move and close issues in seconds. Less time in the tool, more time on the work.',
  },
  {
    title: 'Clear status at a glance',
    body: 'Every issue says where it stands in plain words, from To do to Done, on any screen.',
  },
];

export const ValuePoints = () => {
  return (
    <section className="border-y border-line">
      <div className="mx-auto w-full max-w-7xl px-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,17.5rem),1fr))] gap-10 py-14">
        {values.map((value, i) => (
          <div key={value.title} className="flex flex-col gap-2.5">
            <span className="font-display font-extrabold font-stretch-condensed text-[4rem] leading-none text-brand-ink">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="font-display font-extrabold font-stretch-condensed text-[1.625rem] leading-[1.15]">
              {value.title}
            </h2>
            <p className="font-semibold font-stretch-semi-condensed text-[1.0625rem] leading-6.5 text-ink-muted">
              {value.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const backlog: { title: string; points: string; Icon: LucideIcon; tint: string }[] = [
  { title: 'Export issues to CSV', points: '5 pts', Icon: ChevronUp, tint: 'text-brand-ink' },
  { title: 'Dark mode for the iOS app', points: '3 pts', Icon: AlignLeft, tint: '' },
  { title: 'Tidy up onboarding copy', points: '1 pt', Icon: ChevronDown, tint: 'text-ink-muted' },
];

const IssueFields = () => {
  return (
    <figure
      aria-label="Screenshot: issue fields"
      className="flex flex-[1_1_18.75rem] flex-col gap-3.5"
    >
      <div className="flex flex-col gap-1.5">
        <span className="font-bold font-stretch-semi-condensed text-[0.9375rem] leading-5">
          Status
        </span>
        <div className="box-border h-12 rounded-lg border-[1.5px] border-line-strong flex items-center justify-between px-4">
          <Badge tone="info" />
          <span
            aria-hidden
            className="size-0 border-x-[0.3125rem] border-t-[0.375rem] border-x-transparent border-t-ink"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-bold font-stretch-semi-condensed text-[0.9375rem] leading-5">
          Assignees
        </span>
        <div className="box-border rounded-lg border-[1.5px] border-line-strong flex min-h-12 flex-wrap items-center gap-1.5 px-2 py-1.5">
          <span className="font-semibold font-stretch-semi-condensed inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-sm leading-5 text-on-ink">
            Mira Okafor
          </span>
          <span className="font-semibold font-stretch-semi-condensed inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-sm leading-5 text-on-ink">
            Jonas Lehmann
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(8.75rem,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-bold font-stretch-semi-condensed text-[0.9375rem] leading-5">
            Due date
          </span>
          <div className="box-border h-12 rounded-lg border-[1.5px] border-line-strong flex items-center gap-2.5 px-3.5 text-[0.9375rem]">
            <Calendar
              aria-hidden
              strokeWidth={2}
              className="size-[1.125rem] shrink-0 text-ink-muted"
            />
            30 Oct 2026
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-bold font-stretch-semi-condensed text-[0.9375rem] leading-5">
            Story points
          </span>
          <div className="box-border h-12 rounded-lg border-[1.5px] border-line-strong flex items-stretch overflow-hidden">
            <span className="grid w-11 place-items-center border-r-[1.5px] border-line-strong">
              <Minus aria-hidden strokeWidth={2} className="size-[1.125rem] shrink-0" />
            </span>
            <span className="grid flex-1 place-items-center text-[1.0625rem]">3</span>
            <span className="grid w-11 place-items-center border-l-[1.5px] border-line-strong">
              <Plus aria-hidden strokeWidth={2} className="size-[1.125rem] shrink-0" />
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
};

const smallCards = [
  {
    title: 'Keyboard friendly',
    body: 'Shortcuts for creating, assigning and moving issues, so power users never reach for the mouse.',
    Icon: ArrowRight,
    disc: 'bg-ink text-on-ink',
  },
  {
    title: 'Integrations',
    body: 'Connect your code host, chat and design tools. [List of launch integrations to be confirmed.]',
    Icon: RotateCcw,
    disc: 'bg-brand text-on-brand',
  },
  {
    title: 'Reports that read themselves',
    body: 'Velocity, burndown and cycle time, written in plain words, not just charts.',
    Icon: CreditCard,
    disc: 'bg-surface-muted',
  },
];

export const Features = () => {
  return (
    <section id="features" className="mx-auto w-full max-w-[80rem] px-6 flex flex-col gap-10 py-24">
      <div className="flex max-w-[47.5rem] flex-col gap-3">
        <span className="eyebrow">Features</span>
        <h2 className="headline text-[clamp(2.5rem,3.75vw,4rem)] leading-[0.95]">
          Everything in its right place.
        </h2>
        <p className="font-semibold font-stretch-semi-condensed text-[1.1875rem] leading-7 text-ink-muted">
          The essentials of modern issue tracking, without the clutter. Final feature set to be
          confirmed as requirements settle.
        </p>
      </div>

      <div className="flex flex-wrap gap-5">
        {/* Boards: brand tile */}
        <div className="box-border flex rounded-2xl min-h-[21.25rem] flex-[2_1_35rem] flex-col justify-between gap-8 bg-brand p-10 text-on-brand">
          <span className="eyebrow text-inherit">Boards</span>
          <div className="flex flex-col gap-4">
            <h3 className="headline text-[clamp(2.75rem,3.75vw,4.5rem)] leading-[0.92]">
              Drag. Drop.
              <br />
              Done.
            </h3>
            <p className="font-semibold font-stretch-semi-condensed max-w-[30rem] text-lg leading-[1.625rem]">
              Kanban and scrum boards with WIP limits, swimlanes and quick filters. [Confirm board
              types for v1.]
            </p>
          </div>
        </div>

        {/* Sprints: ink tile */}
        <div className="box-border flex rounded-2xl min-h-[21.25rem] flex-[1_1_18.75rem] flex-col justify-between gap-8 bg-ink p-10 text-on-ink">
          <span className="eyebrow text-inherit">Sprints</span>
          <div className="flex flex-col gap-4">
            <h3 className="headline text-[2.75rem] leading-[0.95]">
              Sprints, not
              <br />
              <span className="text-brand-on-ink">spreadsheets.</span>
            </h3>
            <div className="font-bold font-stretch-semi-condensed flex justify-between text-[0.9375rem] leading-5">
              <span>Sprint 24</span>
              <span>30 / 48 pts</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-ink-muted">
              <div className="h-full w-[62%] rounded-full bg-brand-on-ink" />
            </div>
          </div>
        </div>

        {/* Backlog */}
        <div className="box-border flex rounded-2xl flex-[1_1_21.25rem] flex-col gap-5 bg-surface-muted p-8">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Backlog</span>
            <h3 className="headline text-[1.875rem] leading-none">Prioritise in plain sight</h3>
            <p className="font-semibold font-stretch-semi-condensed text-base leading-6 text-ink-muted">
              Rank work by priority, estimate in points and pull it into the next sprint in one
              move.
            </p>
          </div>
          <figure
            aria-label="Screenshot: backlog list"
            className="rounded-xl border border-line bg-surface px-4 py-1.5"
          >
            {backlog.map(({ title, points, Icon, tint }) => (
              <div
                key={title}
                className="flex items-center gap-3 border-b border-line py-3.5 last:border-b-0"
              >
                <Icon aria-hidden strokeWidth={2} className={`size-[1.125rem] shrink-0 ${tint}`} />
                <span className="font-bold font-stretch-semi-condensed flex-1 text-base leading-[1.375rem]">
                  {title}
                </span>
                <span className="font-semibold font-stretch-semi-condensed text-sm leading-5 text-ink-muted tabular-nums">
                  {points}
                </span>
              </div>
            ))}
          </figure>
        </div>

        {/* Issue detail */}
        <div className="box-border flex rounded-2xl flex-[2_1_35rem] flex-wrap gap-8 border border-line bg-surface p-8">
          <div className="flex flex-[1_1_13.75rem] flex-col gap-2">
            <span className="eyebrow">Issue detail</span>
            <h3 className="headline text-[1.875rem] leading-none">Every detail, one screen</h3>
            <p className="font-semibold font-stretch-semi-condensed text-base leading-6 text-ink-muted">
              Status, owners, labels, due dates and estimates sit together, so updates take one pass
              instead of five clicks.
            </p>
          </div>
          <IssueFields />
        </div>

        {smallCards.map(({ title, body, Icon, disc }) => (
          <div
            key={title}
            className="box-border flex rounded-2xl flex-[1_1_17.5rem] flex-col gap-3 border border-line bg-surface p-8"
          >
            <span className={`grid shrink-0 place-items-center rounded-full size-12 ${disc}`}>
              <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0" />
            </span>
            <h3 className="font-display font-extrabold font-stretch-condensed text-[1.625rem] leading-[1.1]">
              {title}
            </h3>
            <p className="font-semibold font-stretch-semi-condensed text-base leading-6 text-ink-muted">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
