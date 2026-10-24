import { buttonClass } from '@sprintstack/ui';

const links = [
  { href: '#features', label: 'Product' },
  { href: '#mobile', label: 'Mobile' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];

/** The wordmark; on ink the dot switches to brand-on-ink. */
export function Logo({ className, onInk }: { className: string; onInk?: boolean }) {
  return (
    <span className={`headline leading-none ${className}`}>
      SprintStack<span className={onInk ? 'text-brand-on-ink' : 'text-brand-ink'}>.</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-[80rem] px-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5">
      <a href="#top" aria-label="SprintStack home" className="text-ink no-underline">
        <Logo className="text-[1.875rem]" />
      </a>
      <nav
        aria-label="Main"
        className="font-bold font-stretch-semi-condensed flex flex-wrap gap-x-7 gap-y-2 text-[1.0625rem] leading-6"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-ink no-underline hover:text-brand-ink"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <a href="#signin" className="link text-base leading-5">
          Sign in
        </a>
        <a href="#waitlist" className={buttonClass('primary', 'sm')}>
          Get early access
        </a>
      </div>
    </header>
  );
}
