'use client';

import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

const questions = [
  {
    q: 'When does [Product name] launch?',
    a: 'We are planning a public beta for [launch date]. Waitlist members get access first and help shape the roadmap.',
  },
  {
    q: 'Can I import from my current tracker?',
    a: '[Import sources to be confirmed.] We aim to support CSV import at launch, with direct imports from popular trackers to follow.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. Native apps for iOS and Android share the same boards and issues as the web app.',
  },
  {
    q: 'How is my data kept safe?',
    a: '[Security and hosting details to be confirmed: data location, encryption, certifications.]',
  },
];

/** One answer open at a time; the first starts open. */
export function Faq() {
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <section id="faq" className="mx-auto w-full max-w-[80rem] px-6 flex flex-col gap-8 pb-24">
      <h2 className="headline text-[clamp(2.5rem,3.75vw,4rem)] leading-[0.95]">Questions.</h2>
      <div className="flex flex-col gap-3">
        {questions.map(({ q, a }, i) => {
          const expanded = open === i;
          const Icon = expanded ? Minus : Plus;
          return (
            <div key={q} className="rounded-[1.5rem] bg-surface-muted">
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(expanded ? -1 : i)}
                className="font-display font-extrabold font-stretch-condensed flex min-h-[4.5rem] w-full cursor-pointer items-center justify-between gap-4 rounded-[1.5rem] px-7 py-5 text-left text-[1.3125rem] leading-[1.2] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {q}
                <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0 text-brand-ink" />
              </button>
              <p
                id={`${id}-${i}`}
                hidden={!expanded}
                className="font-semibold font-stretch-semi-condensed text-[1.0625rem] leading-[1.625rem] text-ink-muted px-7 pb-6"
              >
                {a}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
