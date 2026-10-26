import type { ReactNode } from 'react';
import { Logo } from '@/components/landing/site-header';

/** Where privacy requests and questions about the terms go. Must be an inbox someone reads. */
export const LEGAL_CONTACT = 'contact@sprintstack.io';

/** Shown under each page title; update it whenever either document changes. */
export const LEGAL_UPDATED = '26 October 2026';

export const ContactLink = () => (
  <a href={`mailto:${LEGAL_CONTACT}`} className="link">
    {LEGAL_CONTACT}
  </a>
);

/** The privacy notice and terms of use: a narrow reading column with the site's logo and links. */
export const LegalPage = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-canvas px-6 py-5 text-ink">
      <header className="mx-auto flex w-full max-w-[45rem] flex-wrap items-center justify-between gap-4">
        <a href="/" aria-label="SprintStack home" className="text-ink no-underline">
          <Logo className="text-[1.875rem]" />
        </a>
        <a href="/signin" className="link text-base leading-5">
          Sign in
        </a>
      </header>
      <main className="mx-auto flex w-full max-w-[45rem] flex-1 flex-col gap-8 py-12">
        <div className="flex flex-col gap-2">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="headline m-0 text-[clamp(2.5rem,7vw,3.5rem)] leading-[0.95]">{title}</h1>
          <p className="m-0 text-meta text-ink-muted">Last updated {LEGAL_UPDATED}</p>
        </div>
        <div className="rich-text [&_a]:whitespace-normal [&_h2]:mt-10">{children}</div>
      </main>
      <footer className="mx-auto flex w-full max-w-[45rem] flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-meta font-semibold text-ink-muted">
        <span>© SprintStack</span>
        <a href="/privacy" className="text-ink-muted hover:text-ink">
          Privacy
        </a>
        <a href="/terms" className="text-ink-muted hover:text-ink">
          Terms
        </a>
      </footer>
    </div>
  );
};
