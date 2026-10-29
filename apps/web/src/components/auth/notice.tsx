import { Check, CircleAlert, Info } from 'lucide-react';
import type { ReactNode } from 'react';

const tones = {
  danger: {
    box: 'border-[1.5px] border-danger bg-surface-muted',
    icon: 'text-danger',
    Icon: CircleAlert,
  },
  success: {
    box: 'border border-success bg-success-subtle',
    icon: 'text-success-ink',
    Icon: Check,
  },
  info: { box: 'border border-line bg-surface-muted', icon: 'text-ink-muted', Icon: Info },
};

/**
 * A boxed message: an error (wrong password), a success (reset link sent) or something to know
 * before going on (what signing up creates).
 */
export const Notice = ({
  tone,
  title,
  children,
}: {
  tone: keyof typeof tones;
  title?: string;
  children?: ReactNode;
}) => {
  const { box, icon, Icon } = tones[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-2xl px-4.5 py-4 ${box}`}
    >
      <span className={`flex-none ${icon}`}>
        <Icon aria-hidden strokeWidth={2} className="size-6" />
      </span>
      <div className="flex flex-col gap-0.5">
        {title && <strong className="headline text-[1.0625rem] leading-5.5">{title}</strong>}
        {children && (
          <span
            className={`text-[0.9375rem] leading-5 font-semibold font-stretch-semi-condensed ${title ? 'text-ink-muted' : 'text-ink'}`}
          >
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
