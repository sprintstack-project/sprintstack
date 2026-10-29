'use client';

import {
  type CommandGroup,
  CommandPalette,
  Header,
  type HeaderNotification,
  type Option,
  Sidebar,
  type SidebarSection,
  type Theme,
} from '@sprintstack/ui';
import {
  CalendarClock,
  ChartNoAxesGantt,
  LayoutDashboard,
  ListTodo,
  LogOut,
  ShieldCheck,
  SlidersVertical,
  SquareStack,
  SunMoon,
  UserCog,
  UserGroup,
  UserRound,
  Workflow,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

/** "Mira Okafor" → "MO", for the avatar when there's no photo. */
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const openProfile = () => {};
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const signOut = async () => {
    await authClient.signOut();
    router.push('/signin');
  };
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Follows the system until switched. Not persisted yet, so a reload goes back to the system.
  const [theme, setTheme] = useState<Theme>();
  useEffect(() => {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);
  const changeTheme = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

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
      items: [
        { key: 'workflows', label: 'Workflows', icon: Workflow, href: '/main/workflows' },
        { key: 'users', label: 'Users & permissions', icon: UserCog, href: '/main/users' },
      ],
    },
  ];

  const active = pathname?.split('/')[1];
  const currentLabel = sections
    .flatMap((section) => section.items)
    .find((item) => item.key === active)?.label;

  // Placeholder until notifications come from the API.
  const [notifications, setNotifications] = useState<HeaderNotification[]>([
    {
      id: '1',
      title: 'Mira Okafor assigned you PAY-142',
      description: 'Retry failed card payouts',
      time: '5m ago',
      avatar: 'MO',
      unread: true,
    },
    {
      id: '2',
      title: 'Sprint 14 starts tomorrow',
      time: 'Yesterday',
      icon: CalendarClock,
    },
  ]);

  const commands: CommandGroup[] = [
    {
      title: 'Pages',
      items: sections.flatMap((section) =>
        section.items.map((item) => ({
          key: item.key,
          label: item.label,
          icon: item.icon,
          onSelect: () => item.href && router.push(item.href),
        })),
      ),
    },
    {
      title: 'Actions',
      items: [
        {
          key: 'theme',
          label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
          icon: SunMoon,
          keywords: ['dark', 'light', 'appearance'],
          onSelect: () => changeTheme(theme === 'dark' ? 'light' : 'dark'),
        },
      ],
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
            active={active}
            user={
              session
                ? {
                    name: session.user.name,
                    email: session.user.email,
                    // GitHub accounts bring a photo; everyone else gets their initials.
                    avatar: session.user.image || initialsOf(session.user.name),
                    options: account,
                    searchable: false,
                  }
                : undefined
            }
            linkComponent={Link}
          />
          <div className="min-w-0 flex-1">
            <Header
              breadcrumbs={[
                { label: 'Payments', href: '/dashboard' },
                { label: currentLabel ?? 'Home' },
              ]}
              linkComponent={Link}
              search={{ onOpen: () => setPaletteOpen(true) }}
              notifications={{
                items: notifications,
                onSelect: (picked) =>
                  setNotifications((all) =>
                    all.map((n) => (n.id === picked.id ? { ...n, unread: false } : n)),
                  ),
                onMarkAllRead: () =>
                  setNotifications((all) => all.map((n) => ({ ...n, unread: false }))),
              }}
              theme={theme}
              onThemeChange={changeTheme}
            />
            {children}
          </div>
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} groups={commands} />
        </div>
      </Sidebar.Provider>
    </div>
  );
};

export default MainLayout;
