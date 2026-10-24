'use client';

import { buttonClass, Field, Input } from '@sprintstack/ui';
import { type FormEvent, useState } from 'react';

// Not wired to a backend yet: submitting just confirms on the page.
function useWaitlist() {
  const [joined, setJoined] = useState(false);
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setJoined(true);
  };
  return { joined, onSubmit };
}

const submit = (label = 'Join the waitlist') => (
  <button type="submit" className={buttonClass('brand', 'sm')}>
    {label}
  </button>
);

/** Hero form: a Field with the pill search-bar Input. */
export function WaitlistForm() {
  const { joined, onSubmit } = useWaitlist();
  return (
    <form id="waitlist" onSubmit={onSubmit} className="max-w-[32.5rem]">
      <Field
        label="Work email"
        htmlFor="hero-email"
        description={
          joined
            ? "Thanks, you're on the list. We'll be in touch before launch."
            : 'Free during the beta · No credit card · Launching [launch date]'
        }
      >
        <Input
          id="hero-email"
          type="email"
          placeholder="you@company.com"
          pill
          slots={{ right: submit() }}
        />
      </Field>
    </form>
  );
}

/** Closing call to action on the ink panel: same form, inverted colours. */
export function CtaForm() {
  const { joined, onSubmit } = useWaitlist();
  return (
    <form onSubmit={onSubmit} className="flex flex-[1_1_22.5rem] flex-col gap-2.5">
      <label
        htmlFor="cta-email"
        className="font-bold font-stretch-semi-condensed text-[1.0625rem] leading-[1.375rem]"
      >
        Get on the list
      </label>
      <div className="flex min-h-14 items-center gap-2 rounded-full bg-canvas pr-1.5 pl-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-on-ink">
        <input
          id="cta-email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent text-[1.0625rem] leading-6 text-ink outline-none placeholder:text-ink-placeholder"
        />
        {submit()}
      </div>
      <span role="status" className="font-semibold font-stretch-semi-condensed text-sm leading-5">
        {joined
          ? "Thanks, you're on the list. We'll be in touch before launch."
          : 'We will only email you about the launch. Unsubscribe any time.'}
      </span>
    </form>
  );
}
