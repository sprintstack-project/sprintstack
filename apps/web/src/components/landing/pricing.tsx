import { buttonClass } from '@sprintstack/ui';

const plans = [
  {
    name: 'Free',
    price: '[PRICE]',
    blurb: 'For small teams getting started',
    features: ['Up to [N] members', 'Unlimited issues', 'Boards and backlog'],
    cta: { label: 'Join the waitlist', href: '#waitlist', variant: 'secondary' as const },
  },
  {
    name: 'Team',
    price: '[PRICE]',
    per: ' / member / month',
    blurb: 'For product teams running sprints',
    features: ['Everything in Free', 'Sprints and reports', 'Integrations', 'Mobile apps'],
    cta: { label: 'Join the waitlist', href: '#waitlist', variant: 'brand' as const },
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'For larger organisations',
    features: [
      'Everything in Team',
      'Single sign-on [to be confirmed]',
      'Audit log and admin controls',
      'Dedicated support',
    ],
    cta: { label: 'Contact us', href: '#contact', variant: 'primary' as const },
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-line">
      <div className="mx-auto w-full max-w-[80rem] px-6 flex flex-col gap-10 py-24">
        <div className="flex max-w-[45rem] flex-col gap-3">
          <span className="eyebrow">Pricing</span>
          <h2 className="headline text-[clamp(2.5rem,3.75vw,4rem)] leading-[0.95]">
            Simple pricing.
          </h2>
          <p className="font-semibold font-stretch-semi-condensed text-[1.1875rem] leading-7 text-ink-muted">
            Plans and prices are still being finalised. Join the waitlist to hear first.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18.75rem),1fr))] items-stretch gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col gap-5 rounded-xl ${
                plan.recommended ? 'border-2 border-ink p-[1.9375rem]' : 'border border-line p-8'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="headline text-[1.75rem] leading-none">{plan.name}</h3>
                {plan.recommended && (
                  // A label, not a status, so it doesn't use Badge's tones.
                  <span className="inline-flex h-7 items-center rounded-full bg-brand px-3 font-display text-[0.8125rem] leading-4 font-extrabold tracking-[.03em] whitespace-nowrap text-on-brand uppercase font-stretch-condensed">
                    Recommended
                  </span>
                )}
              </div>
              <span className="font-display font-extrabold font-stretch-condensed text-5xl leading-none">
                {plan.price}
                {plan.per && (
                  <span className="font-semibold font-stretch-semi-condensed text-base leading-none text-ink-muted">
                    {plan.per}
                  </span>
                )}
              </span>
              <span className="font-semibold font-stretch-semi-condensed text-sm leading-5 text-ink-muted tabular-nums">
                {plan.blurb}
              </span>
              <ul className="flex flex-col gap-2.5 border-t border-line-strong pt-5 text-base">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a href={plan.cta.href} className={`${buttonClass(plan.cta.variant)} mt-auto`}>
                {plan.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
