import { Badge, buttonClass, type StatusTone } from '@sprintstack/ui';
import {
  Check,
  ChevronLeft,
  CreditCard,
  type LucideIcon,
  RotateCcw,
  Search,
  User,
} from 'lucide-react';

const issues: {
  tone: StatusTone;
  when: string;
  title: string;
  detail?: string;
  progress?: number;
}[] = [
  {
    tone: 'danger',
    when: 'Due today',
    title: 'Checkout fails on saved cards',
    detail: 'PAY-1482 · Payments',
  },
  { tone: 'review', when: '2h ago', title: 'Add Apple Pay to checkout', progress: 60 },
  { tone: 'neutral', when: 'Fri', title: 'Retry failed payouts' },
];

const tabs: { label: string; Icon: LucideIcon }[] = [
  { label: 'Issues', Icon: CreditCard },
  { label: 'Sprint', Icon: RotateCcw },
  { label: 'Search', Icon: Search },
  { label: 'Profile', Icon: User },
];

const perks = [
  'Triage and assign from anywhere',
  'Notifications for mentions and due dates',
  '[Offline support to be confirmed]',
];

const PhoneScreenshot = () => {
  return (
    <figure aria-label="Screenshot: mobile app, My issues" className="flex justify-center">
      <div className="box-border w-[21.25rem] max-w-full rounded-[3rem] bg-ink p-3">
        <div className="box-border flex h-[41.25rem] flex-col gap-3.5 overflow-hidden rounded-[2.375rem] bg-canvas px-3.5 pt-4 pb-3.5 text-ink">
          <div className="flex h-14 flex-none items-center gap-3 rounded-[1.25rem] bg-brand px-4 text-on-brand">
            <ChevronLeft aria-hidden strokeWidth={2} className="size-6" />
            <span className="font-display font-extrabold font-stretch-condensed text-[1.375rem] leading-none">
              My issues
            </span>
          </div>
          <div className="flex flex-none gap-2">
            <span className="font-bold font-stretch-semi-condensed inline-flex items-center rounded-full px-3.5 text-sm leading-5 bg-ink text-on-ink h-[2.125rem]">
              Today
            </span>
            <span className="font-bold font-stretch-semi-condensed inline-flex items-center rounded-full px-3.5 text-sm leading-5 border-[1.5px] border-line-strong h-[2.125rem]">
              This week
            </span>
            <span className="font-bold font-stretch-semi-condensed inline-flex items-center rounded-full px-3.5 text-sm leading-5 border-[1.5px] border-line-strong h-[2.125rem]">
              Overdue
            </span>
          </div>
          {issues.map((issue) => (
            <div
              key={issue.title}
              className="flex flex-col gap-2 rounded-[1.125rem] border border-line p-3.5"
            >
              <div className="flex items-center justify-between">
                <Badge tone={issue.tone} />
                <span className="font-semibold font-stretch-semi-condensed text-sm leading-5 text-ink-muted tabular-nums">
                  {issue.when}
                </span>
              </div>
              <span className="font-display font-extrabold font-stretch-condensed text-[1.1875rem] leading-[1.15]">
                {issue.title}
              </span>
              {issue.detail && (
                <span className="font-semibold font-stretch-semi-condensed text-sm leading-5 text-ink-muted tabular-nums">
                  {issue.detail}
                </span>
              )}
              {issue.progress !== undefined && (
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-brand-ink"
                    style={{ width: `${issue.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
          <div className="mt-auto grid h-[4.5rem] flex-none grid-cols-4 items-center rounded-[1.625rem] bg-ink text-on-ink">
            {tabs.map(({ label, Icon }, i) => (
              <span
                key={label}
                className={`headline flex flex-col items-center gap-0.5 text-[0.6875rem] leading-[0.875rem] ${
                  i === 0 ? 'text-brand-on-ink' : ''
                }`}
              >
                <Icon aria-hidden strokeWidth={2} className="size-[1.125rem] shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
};

export const Mobile = () => {
  return (
    <section id="mobile" className="bg-surface-muted">
      <div className="mx-auto w-full max-w-[80rem] px-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,26.25rem),1fr))] items-center gap-14 py-24">
        <PhoneScreenshot />
        <div className="flex flex-col gap-6">
          <span className="eyebrow">Mobile</span>
          <h2 className="headline text-[clamp(2.75rem,4.125vw,4.5rem)] leading-[0.92]">
            Your sprint,
            <br />
            <span className="text-brand-ink">in your pocket.</span>
          </h2>
          <p className="font-semibold font-stretch-semi-condensed text-[1.1875rem] leading-7 text-ink-muted max-w-[32.5rem]">
            The same boards, issues and updates on iOS and Android, designed for one-handed triage
            between meetings.
          </p>
          <ul className="flex flex-col gap-3.5">
            {perks.map((perk) => (
              <li
                key={perk}
                className="font-bold font-stretch-semi-condensed flex items-center gap-3 text-lg leading-6"
              >
                <span className="grid shrink-0 place-items-center rounded-full size-8 bg-ink text-on-ink">
                  <Check aria-hidden strokeWidth={2} className="size-[1.125rem] shrink-0" />
                </span>
                {perk}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href="#waitlist" className={buttonClass('secondary')}>
              iOS: coming [date]
            </a>
            <a href="#waitlist" className={buttonClass('secondary')}>
              Android: coming [date]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
