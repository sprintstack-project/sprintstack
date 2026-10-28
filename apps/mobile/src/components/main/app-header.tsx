import {
  type CommandGroup,
  CommandPalette,
  Header,
  type HeaderNotification,
  type SidebarProject,
  type SidebarUser,
  useSidebar,
} from '@sprintstack/ui';
import { type Href, router, useSegments } from 'expo-router';
import { CalendarClock, SunMoon } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { Uniwind, useUniwind, withUniwind } from 'uniwind';
import { SECTIONS } from '@/components/main/navigation';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);

const PAGES = SECTIONS.flatMap((section) => section.items);

// Placeholder until notifications come from the API (same as the web layout).
const NOTIFICATIONS: HeaderNotification[] = [
  {
    id: '1',
    title: 'Mira Okafor assigned you PAY-142',
    description: 'Retry failed card payouts',
    time: '5m ago',
    avatar: 'MO',
    unread: true,
  },
  { id: '2', title: 'Sprint 14 starts tomorrow', time: 'Yesterday', icon: CalendarClock },
];

/**
 * The header above every signed-in screen, with its command palette. Tablets get the sidebar
 * toggle and breadcrumbs; phones (no sidebar) the project and account switchers instead.
 */
export const AppHeader = ({ project, user }: { project: SidebarProject; user: SidebarUser }) => {
  const { drawer } = useSidebar();
  const segments = useSegments();
  const { theme } = useUniwind();
  const dark = theme === 'dark';
  const [paletteOpen, setPaletteOpen] = useState(false);
  const page = PAGES.find((item) => item.key === segments[1]);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const commands: CommandGroup[] = [
    {
      title: 'Pages',
      items: PAGES.map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon,
        onSelect: () => item.href && router.navigate(item.href as Href),
      })),
    },
    {
      title: 'Actions',
      items: [
        {
          key: 'theme',
          label: dark ? 'Switch to light theme' : 'Switch to dark theme',
          icon: SunMoon,
          keywords: ['dark', 'light', 'appearance'],
          onSelect: () => Uniwind.setTheme(dark ? 'light' : 'dark'),
        },
      ],
    },
  ];

  return (
    // The sidebar keeps clear of the left edge itself; the tab bar, of the bottom.
    <SafeAreaView edges={['top', 'right']} className="bg-canvas">
      <Header
        toggle={!drawer}
        breadcrumbs={[{ label: project.name }, { label: page?.label ?? 'Home' }]}
        project={project}
        user={user}
        search={{ onOpen: () => setPaletteOpen(true) }}
        notifications={{
          items: notifications,
          onSelect: (picked) =>
            setNotifications((all) =>
              all.map((n) => (n.id === picked.id ? { ...n, unread: false } : n)),
            ),
          onMarkAllRead: () => setNotifications((all) => all.map((n) => ({ ...n, unread: false }))),
        }}
        theme={dark ? 'dark' : 'light'}
        onThemeChange={(next) => Uniwind.setTheme(next)}
      />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} groups={commands} />
    </SafeAreaView>
  );
};
