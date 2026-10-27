import type { ReactNode } from 'react';
import { Logo } from '@/components/landing/site-header';

export interface AuthAside {
  eyebrow: string;
  /** The poster headline; wrap the last words in <em> to colour them. */
  title: ReactNode;
  children?: ReactNode;
}

const widths = { md: 'max-w-[27.5rem]', lg: 'max-w-[28.75rem]', xl: 'max-w-[32.5rem]' };

/**
 * The sign-in and sign-up frame: logo and a header link, the form column, and an ink poster panel
 * on wide screens (hidden below 960px).
 */
export const AuthShell = ({
  headerRight,
  aside,
  width = 'md',
  children,
}: {
  headerRight?: ReactNode;
  aside: AuthAside;
  width?: keyof typeof widths;
  children: ReactNode;
}) => {
  return (
    <div className="flex min-h-screen flex-1 flex-wrap gap-4 bg-canvas p-4 text-ink">
      <div className="flex min-w-0 flex-[1_1_32.5rem] flex-col px-6 py-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" aria-label="SprintStack home" className="text-ink no-underline">
            <Logo className="text-[1.875rem]" />
          </a>
          {headerRight && (
            <div className="text-meta font-semibold text-ink-muted">{headerRight}</div>
          )}
        </header>
        <main className="flex flex-1 items-center justify-center py-12">
          <div className={`flex w-full flex-col gap-6 ${widths[width]}`}>{children}</div>
        </main>
        <footer className="flex flex-wrap gap-x-6 gap-y-2 text-meta font-semibold text-ink-muted">
          <span>© SprintStack</span>
          <a href="/privacy" className="text-ink-muted hover:text-ink">
            Privacy
          </a>
          <a href="/terms" className="text-ink-muted hover:text-ink">
            Terms
          </a>
          <a href="/help" className="text-ink-muted hover:text-ink">
            Help
          </a>
        </footer>
      </div>
      <aside className="hidden min-h-160 flex-[1_1_30rem] flex-col justify-between gap-8 rounded-2xl bg-ink p-12 text-on-ink min-[60rem]:flex">
        <span className="font-display text-[0.8125rem] leading-4 font-bold uppercase tracking-[.03em] font-stretch-semi-condensed">
          {aside.eyebrow}
        </span>
        <div className="flex flex-col gap-6">
          <h2 className="headline text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.9] [&_em]:text-brand-on-ink [&_em]:not-italic">
            {aside.title}
          </h2>
          {aside.children && (
            <div className="max-w-105 text-[1.125rem] leading-6.5 font-semibold font-stretch-semi-condensed">
              {aside.children}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

/** The page title block: optional eyebrow, the headline, and a lead paragraph. */
export const AuthHeading = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="headline m-0 text-[3rem] leading-[0.95]">{title}</h1>
      {children && (
        <p className="m-0 text-[1.0625rem] leading-6 font-semibold font-stretch-semi-condensed text-ink-muted [&_strong]:text-ink">
          {children}
        </p>
      )}
    </div>
  );
};

/** A round icon badge above a heading (brand by default). */
export const AuthIcon = ({ children }: { children: ReactNode }) => {
  return (
    <span className="grid size-16 place-items-center rounded-full bg-brand text-on-brand [&_svg]:size-7">
      {children}
    </span>
  );
};
