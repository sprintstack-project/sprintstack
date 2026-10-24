import { Logo } from './site-header';
import { CtaForm } from './waitlist-form';

export function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-[80rem] px-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-10 rounded-2xl bg-ink p-[clamp(2rem,4.5vw,4.5rem)] text-on-ink">
        <div className="flex flex-[1_1_26.25rem] flex-col gap-5">
          <span className="eyebrow text-inherit">Early access</span>
          <h2 className="headline text-[clamp(3.5rem,6vw,7rem)] leading-[0.9]">
            Real work.
            <br />
            <span className="text-brand-on-ink">Shipped.</span>
          </h2>
        </div>
        <CtaForm />
      </div>
    </section>
  );
}

const columns = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#mobile', label: 'Mobile' },
      { href: '#pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '#contact', label: 'About us' },
      { href: '#contact', label: 'Contact' },
      { href: '#contact', label: 'Careers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '#faq', label: 'FAQ' },
      { href: '#contact', label: 'Help centre' },
      { href: '#contact', label: 'Status' },
    ],
  },
];

const legal = ['Privacy notice', 'Terms of use', 'Cookie settings'];

export function SiteFooter() {
  return (
    <footer id="contact" className="rounded-t-2xl bg-ink text-on-ink">
      <div className="mx-auto w-full max-w-[80rem] px-6 flex flex-col gap-12 pt-16 pb-8">
        <div className="flex flex-wrap justify-between gap-10">
          <Logo className="text-[2.75rem]" onInk />
          <div className="flex flex-wrap gap-x-[4.5rem] gap-y-12">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
                <span className="eyebrow text-inherit opacity-72">{column.title}</span>
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-on-ink no-underline hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="font-semibold font-stretch-semi-condensed flex flex-wrap justify-between gap-4 border-t border-ink-muted pt-6 text-sm leading-5">
          <span>© [Year] [Company name]. All rights reserved.</span>
          <div className="flex flex-wrap gap-6">
            {legal.map((label) => (
              <a key={label} href="#contact" className="text-on-ink underline">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
