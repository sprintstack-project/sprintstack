import { Badge, type StatusTone } from '@sprintstack/ui';

interface Issue {
  id: string;
  title: string;
  tone: StatusTone;
  assignee: string;
  /** The assignee chip in ink rather than muted. */
  mine?: boolean;
  /** Highlighted card with a progress bar (percent). */
  progress?: number;
}

const columns: { title: string; issues: Issue[] }[] = [
  {
    title: 'To do · 4',
    issues: [
      {
        id: 'PAY-1490',
        title: 'Retry failed payouts automatically',
        tone: 'neutral',
        assignee: 'AR',
      },
      { id: 'PAY-1488', title: 'Update receipt email template', tone: 'neutral', assignee: 'DP' },
    ],
  },
  {
    title: 'In progress · 3',
    issues: [
      {
        id: 'PAY-1482',
        title: 'Checkout fails on saved cards',
        tone: 'info',
        assignee: 'MO',
        mine: true,
        progress: 60,
      },
      {
        id: 'PAY-1477',
        title: 'Add Apple Pay to checkout',
        tone: 'review',
        assignee: 'JL',
        mine: true,
      },
    ],
  },
  {
    title: 'Done · 5',
    issues: [
      { id: 'OPS-311', title: 'Rotate webhook secret', tone: 'success', assignee: 'SK' },
      {
        id: 'PAY-1471',
        title: '3-D Secure for EU cards',
        tone: 'success',
        assignee: 'MO',
        mine: true,
      },
    ],
  },
];

function IssueCard({ issue }: { issue: Issue }) {
  const active = issue.progress !== undefined;
  return (
    <div
      className={`flex flex-col gap-2 rounded-[0.875rem] bg-surface ${
        active ? 'border-2 border-ink p-[0.6875rem]' : 'border border-line p-3'
      }`}
    >
      <span className="font-semibold font-stretch-semi-condensed text-xs leading-4 text-ink-muted">
        {issue.id}
      </span>
      <span className="font-display font-extrabold font-stretch-condensed text-[1.0625rem] leading-[1.15]">
        {issue.title}
      </span>
      {active && (
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand-ink"
            style={{ width: `${issue.progress}%` }}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <Badge tone={issue.tone} />
        <span
          className={`font-display font-extrabold font-stretch-condensed size-6 rounded-full text-center text-[0.625rem] leading-6 ${
            issue.mine ? 'bg-ink text-on-ink' : 'bg-surface-muted'
          }`}
        >
          {issue.assignee}
        </span>
      </div>
    </div>
  );
}

function BoardScreenshot() {
  return (
    <figure aria-label="Screenshot: sprint board" className="rounded-2xl bg-surface-muted p-4">
      <div className="overflow-hidden rounded-xl border border-line bg-canvas">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          {[0, 1, 2].map((dot) => (
            <span key={dot} aria-hidden className="size-2.5 rounded-full bg-line" />
          ))}
          <span className="font-semibold font-stretch-semi-condensed ml-3 rounded-full bg-surface-muted px-3 py-0.5 text-[0.8125rem] leading-5 text-ink-muted">
            [product].sprintstack.dev/board
          </span>
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="eyebrow">Payments · Sprint 24</span>
              <span className="headline text-[1.875rem] leading-none">Board (12)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold font-stretch-semi-condensed inline-flex items-center rounded-full px-3.5 text-sm leading-5 bg-ink text-on-ink h-8">
                Assigned to me
              </span>
              <span className="font-bold font-stretch-semi-condensed inline-flex items-center rounded-full px-3.5 text-sm leading-5 border-[1.5px] border-line-strong h-8">
                Bugs
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(9.375rem,1fr))] gap-3">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-2.5">
                <span className="headline text-sm leading-5 text-ink-muted">{column.title}</span>
                {column.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto w-full max-w-7xl px-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,28.75rem),1fr))] items-center gap-14 pt-12 pb-24"
    >
      <div className="flex flex-col gap-6">
        <span className="eyebrow">Issue tracking for teams that ship</span>
        <h1 className="headline text-[clamp(3.75rem,6vw,6.5rem)] leading-[0.9] tracking-[-0.01em]">
          Plan it.
          <br />
          Track it.
          <br />
          <span className="text-brand-ink">Ship it.</span>
        </h1>
        <p className="font-semibold font-stretch-semi-condensed max-w-130 text-xl leading-7.5 text-ink-muted">
          <strong>SprintStack</strong> brings your backlog, sprints and releases into one fast,
          friendly workspace, on the web and in your pocket. Built for product teams who would
          rather ship than update tickets.
        </p>
      </div>
      <BoardScreenshot />
    </section>
  );
}
