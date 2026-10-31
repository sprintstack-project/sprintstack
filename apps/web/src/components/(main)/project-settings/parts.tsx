'use client';

import { Button } from '@ui/button';
import { Switch } from '@ui/switch';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

/** A settings section: its headline and what it's for, then its fields. */
export const Panel = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-8 rounded-3xl border border-line bg-surface p-6 md:p-10">
    <header className="flex flex-col gap-2">
      <h2 className="headline text-[2.25rem] leading-none text-ink">{title}</h2>
      <p className="text-[1.0625rem] leading-6 text-ink-muted font-stretch-semi-condensed">
        {description}
      </p>
    </header>
    {children}
  </section>
);

/** A setting that's on or off: its title and what it does, the switch on the right. */
export const ToggleRow = ({
  title,
  description,
  checked,
  onCheckedChange,
  className,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) => (
  <div className={clsx('flex items-center justify-between gap-6', className)}>
    <div className="flex min-w-0 flex-col gap-1 font-stretch-semi-condensed">
      <p className="text-[1.0625rem] leading-6 font-bold text-ink">{title}</p>
      <p className="text-[1.0625rem] leading-6 text-ink-muted">{description}</p>
    </div>
    <Switch label={title} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

/** Save (the form's submit button, passed in) and Discard, which goes back to what was saved. */
export const Actions = ({ save, onDiscard }: { save: ReactNode; onDiscard: () => void }) => (
  <div className="flex flex-wrap items-center gap-3">
    {save}
    <Button variant="ghost" size="lg" onClick={onDiscard}>
      Discard
    </Button>
  </div>
);
