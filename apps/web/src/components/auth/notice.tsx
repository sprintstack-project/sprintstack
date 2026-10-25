import { Check, CircleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

/** A boxed message: an error (wrong password) or a success (reset link sent). */
export const Notice = ({
  tone,
  title,
  children,
}: {
  tone: 'danger' | 'success';
  title: string;
  children?: ReactNode;
}) => {
  const danger = tone === 'danger';
  return (
    <div
      role={danger ? 'alert' : 'status'}
      className={
        danger
          ? 'flex items-start gap-3 rounded-2xl border-[1.5px] border-danger bg-surface-muted px-4.5 py-4'
          : 'flex items-start gap-3 rounded-2xl border border-success bg-success-subtle px-4.5 py-4'
      }
    >
      <span className={danger ? 'flex-none text-danger' : 'flex-none text-success-ink'}>
        {danger ? (
          <CircleAlert aria-hidden strokeWidth={2} className="size-6" />
        ) : (
          <Check aria-hidden strokeWidth={2} className="size-6" />
        )}
      </span>
      <div className="flex flex-col gap-0.5">
        <strong className="headline text-[1.0625rem] leading-5.5">{title}</strong>
        {children && (
          <span className="text-[0.9375rem] leading-5 font-semibold font-stretch-semi-condensed text-ink-muted">
            {children}
          </span>
        )}
      </div>
    </div>
  );
};

/** "──── or with email ────" */
export const OrDivider = ({ children = 'or with email' }: { children?: string }) => {
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="h-px flex-1 bg-line" />
      <span className="eyebrow">{children}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
};
