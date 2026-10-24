import { Check } from 'lucide-react';

// The rule and disc fade from ink (done) to brand (next) to line (later).
const steps = [
  {
    title: 'Create a project',
    body: 'Name it, pick a board style and you are ready. Import from your current tracker [if supported at launch].',
    rule: 'border-ink',
    marker: (
      <span className="grid shrink-0 place-items-center rounded-full size-[3.25rem] font-display font-extrabold font-stretch-condensed text-[1.375rem] leading-none bg-ink text-on-ink">
        <Check aria-hidden strokeWidth={2} className="size-6 shrink-0" />
      </span>
    ),
  },
  {
    title: 'Invite your team',
    body: 'Bring in teammates by email or single sign-on and set who can see and change what.',
    rule: 'border-brand',
    marker: (
      <span className="grid shrink-0 place-items-center rounded-full size-[3.25rem] font-display font-extrabold font-stretch-condensed text-[1.375rem] leading-none bg-brand text-on-brand">
        2
      </span>
    ),
  },
  {
    title: 'Plan your first sprint',
    body: 'Drag issues from the backlog, set a goal and start. Progress updates itself as work moves.',
    rule: 'border-line',
    marker: (
      <span className="grid shrink-0 place-items-center rounded-full size-[3.25rem] font-display font-extrabold font-stretch-condensed text-[1.375rem] leading-none box-border border-2 border-line-strong">
        3
      </span>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 flex flex-col gap-12 py-24">
      <div className="flex flex-col gap-3">
        <span className="eyebrow">How it works</span>
        <h2 className="headline text-[clamp(2.5rem,3.75vw,4rem)] leading-[0.95]">
          Up and running in three steps.
        </h2>
      </div>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,17.5rem),1fr))] gap-8">
        {steps.map((step) => (
          <li key={step.title} className={`flex flex-col gap-3.5 border-t-2 pt-6 ${step.rule}`}>
            {step.marker}
            <h3 className="font-display font-extrabold font-stretch-condensed text-[1.625rem] leading-[1.1]">
              {step.title}
            </h3>
            <p className="font-semibold font-stretch-semi-condensed text-[1.0625rem] leading-[1.625rem] text-ink-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
