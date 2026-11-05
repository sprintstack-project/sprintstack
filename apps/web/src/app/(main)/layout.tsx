'use client';

import { useGetMe } from '@sprintstack/api-client';
import { initialsOf } from '@sprintstack/shared';
import { useProjectSwitcher } from '@sprintstack/shared/hooks';
import {
  type CommandGroup,
  CommandPalette,
  Header,
  type Option,
  Sidebar,
  type SidebarSection,
  type Theme,
} from '@sprintstack/ui';
import {
  ChartNoAxesGantt,
  LayoutDashboard,
  ListTodo,
  LogOut,
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
import { disablePush } from '@/lib/push';
import { useBell } from '@/lib/use-bell';

const MainLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const openProfile = () => {};
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const signOut = async () => {
    // While the session still exists: this browser stops getting the person's pushes.
    await disablePush();
    await authClient.signOut();
    router.push('/signin');
  };
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { data: me } = useGetMe();
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
          label: 'Project settings',
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

  const notifications = useBell();

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

  const { project, switcher } = useProjectSwitcher();

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
            project={switcher}
            sections={sections}
            active={active}
            user={
              session
                ? {
                    name: session.user.name,
                    email: session.user.email,
                    // GitHub accounts bring a photo; everyone else gets their initials.
                    avatar: me?.image || initialsOf(session.user.name),
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
                ...(project ? [{ label: project.name, href: '/dashboard' }] : []),
                { label: currentLabel ?? 'Home' },
              ]}
              linkComponent={Link}
              search={{ onOpen: () => setPaletteOpen(true) }}
              notifications={notifications}
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
