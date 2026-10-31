'use client';

import { Bell, CalendarDays, Pencil } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSaved } from './data';

export const SECTIONS = [
  {
    key: 'details',
    label: 'Details',
    description: 'Name, key and description',
    icon: Pencil,
    href: '/project-settings/details',
  },
  {
    key: 'sprints',
    label: 'Sprints',
    description: 'Length and start day',
    icon: CalendarDays,
    href: '/project-settings/sprints',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Who hears about what',
    icon: Bell,
    href: '/project-settings/notifications',
  },
];

/** The page heading and the section list beside the open section. */
const ProjectSettings = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const active = pathname?.split('/')[2];
  const { details } = useSaved();

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">
          {details.name} · {details.key}
        </p>
        <h1 className="headline text-7xl leading-none">
          Project <span className="text-brand-ink">settings</span>
        </h1>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <nav
          aria-label="Project settings"
          className="flex flex-col gap-1 rounded-3xl border border-line bg-surface p-2"
        >
          {SECTIONS.map(({ key, label, description, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              aria-current={key === active ? 'page' : undefined}
              className="kbd-focus flex items-center gap-4 rounded-2xl px-5 py-3.5 text-ink transition-colors duration-120 hover:bg-surface-hover aria-[current=page]:bg-ink aria-[current=page]:text-on-ink"
            >
              <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0" />
              <span className="flex min-w-0 flex-col font-stretch-semi-condensed">
                <span className="text-[1.0625rem] leading-6 font-bold">{label}</span>
                <span className="text-meta opacity-75">{description}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </div>
  );
};

export default ProjectSettings;
