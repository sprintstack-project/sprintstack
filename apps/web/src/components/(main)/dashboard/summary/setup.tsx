import Card from '@ui/card';
import { Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SETUP_STEPS } from '../data';

const Setup = () => {
  const done = SETUP_STEPS.filter((step) => step.done).length;
  return (
    <Card variant="ink">
      <div className="flex flex-1 flex-col gap-6">
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
                <s className="text-body-strong opacity-60 font-stretch-semi-condensed text-lg">
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
                  <span className="flex-1 text-body-strong font-stretch-semi-condensed text-lg">
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

export default Setup;
