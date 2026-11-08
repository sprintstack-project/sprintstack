'use client';

import { useGetMe } from '@sprintstack/api-client/users';
import { initialsOf } from '@sprintstack/shared/initials';
import PageHeading from '@ui/page-heading';
import { Bell, Shield, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// Sections without an href aren't built yet; they're listed so the layout is final.
const SECTIONS = [
  {
    key: 'profile',
    label: 'Profile',
    description: 'Name and photo',
    icon: UserRound,
    href: '/account/profile',
  },
  {
    key: 'security',
    label: 'Password & security',
    description: 'Sign-in methods and sessions',
    icon: Shield,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'How you hear about things',
    icon: Bell,
  },
];

const row = 'flex items-center gap-4 rounded-2xl px-5 py-3.5';

/** The page heading and the section list beside the open section. */
const Account = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const active = pathname?.split('/')[2];
  const { data: me } = useGetMe();

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:p-8">
      <PageHeading eyebrow="Your account · All projects" title="Account" accent="settings" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)]">
        <nav
          aria-label="Account settings"
          className="flex flex-col gap-1 rounded-3xl border border-line bg-surface p-2"
        >
          {me && (
            <div className="flex items-center gap-4 px-5 py-3.5">
              {me.image ? (
                <Image
                  src={me.image}
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="size-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-sm font-extrabold text-on-ink"
                >
                  {initialsOf(me.name)}
                </span>
              )}
              <span className="flex min-w-0 flex-col font-stretch-semi-condensed">
                <span className="truncate headline text-[1.25rem] leading-6 text-ink">
                  {me.name}
                </span>
                <span className="truncate text-meta text-ink-muted">{me.email}</span>
              </span>
            </div>
          )}
          {SECTIONS.map(({ key, label, description, icon: Icon, href }) => {
            const content = (
              <>
                <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0" />
                <span className="flex min-w-0 flex-col font-stretch-semi-condensed">
                  <span className="text-[1.0625rem] leading-6 font-bold">{label}</span>
                  <span className="text-meta opacity-75">{description}</span>
                </span>
              </>
            );
            return href ? (
              <Link
                key={key}
                href={href}
                aria-current={key === active ? 'page' : undefined}
                className={`kbd-focus ${row} text-ink transition-colors duration-120 hover:bg-surface-hover aria-[current=page]:bg-ink aria-[current=page]:text-on-ink`}
              >
                {content}
              </Link>
            ) : (
              <span key={key} aria-disabled className={`${row} text-ink-muted`}>
                {content}
              </span>
            );
          })}
        </nav>
        <div className="flex min-w-0 flex-col gap-6">{children}</div>
      </div>
    </div>
  );
};

export default Account;
