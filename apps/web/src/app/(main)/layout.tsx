'use client';

import { type Option, Sidebar, type SidebarSection } from '@sprintstack/ui';
import {
  ChartNoAxesGantt,
  LayoutDashboard,
  ListTodo,
  LogOut,
  ShieldCheck,
  SlidersVertical,
  SquareStack,
  UserGroup,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const openProfile = () => {};
  const signOut = () => {};

  const sections: SidebarSection[] = [
    {
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { key: 'taskboard', label: 'Taskboard', icon: ListTodo, href: '/taskboard' },
        { key: 'backlog', label: 'Backlog', icon: SquareStack, href: '/backlog' },
        { key: 'timeline', label: 'Timeline', icon: ChartNoAxesGantt, href: '/timeline' },
        { key: 'team', label: 'Team', icon: UserGroup, href: '/team' },
        {
          key: 'project-settings',
          label: 'Project Settings',
          icon: SlidersVertical,
          href: '/project-settings',
        },
      ],
    },
    {
      title: 'Administration',
      items: [{ key: 'users', label: 'Users & permissions', icon: ShieldCheck, href: '/users' }],
    },
  ];

  const projects: Option[] = [
    { value: 'pay', label: 'Payments', avatar: 'PAY', description: 'Scrum' },
    { value: 'ios', label: 'iOS app', avatar: 'IOS', description: 'Kanban' },
  ];

  const account: Option[] = [
    { value: 'profile', label: 'Profile', icon: UserRound, action: openProfile },
    { value: 'sign-out', label: 'Sign out', icon: LogOut, danger: true, action: signOut },
  ];

  return (
    <div>
      <Sidebar.Provider>
        <div className="flex min-h-dvh">
          <Sidebar.Root
            logo={
              <span className="headline text-[2rem] leading-none">
                SprintStack<span className="text-brand-ink">.</span>
              </span>
            }
            logoCollapsed={<Image src="../../icon.svg" alt="SprintStack" width={32} height={32} />}
            project={{
              code: 'PAY',
              name: 'Payments',
              meta: 'Scrum · 5 members',
              options: projects,
              value: 'pay',
              onValueChange: () => {},
            }}
            sections={sections}
            active={pathname?.split('/')[1]}
            user={{
              name: 'Mira Okafor',
              email: 'mira@company.com',
              avatar: 'MO',
              options: account,
              searchable: false,
            }}
            linkComponent={Link}
          />
          <div className="min-w-0 flex-1">
            <header className="flex items-center gap-3 border-b border-line px-6 py-4">
              <Sidebar.Toggle />
            </header>
            {children}
          </div>
        </div>
      </Sidebar.Provider>
    </div>
  );
};

export default MainLayout;
