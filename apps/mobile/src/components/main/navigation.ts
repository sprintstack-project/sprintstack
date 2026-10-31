import type { IconComponent, SidebarItem, SidebarSection } from '@sprintstack/ui';
import {
  Bell,
  CalendarDays,
  ChartNoAxesGantt,
  LayoutDashboard,
  ListTodo,
  Pencil,
  SlidersVertical,
  SquareStack,
  UserCog,
  UserGroup,
  Workflow,
} from 'lucide-react-native';

// Item keys are the route names under app/main, so the current segment marks the active item.
export const SECTIONS: SidebarSection[] = [
  {
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/main/dashboard' },
      { key: 'taskboard', label: 'Taskboard', icon: ListTodo, href: '/main/taskboard' },
      { key: 'backlog', label: 'Backlog', icon: SquareStack, href: '/main/backlog' },
      { key: 'timeline', label: 'Timeline', icon: ChartNoAxesGantt, href: '/main/timeline' },
      { key: 'team', label: 'Team', icon: UserGroup, href: '/main/team' },
      {
        key: 'settings',
        label: 'Project settings',
        icon: SlidersVertical,
        href: '/main/settings',
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

/** The phone tab bar: the main destinations, then Settings, which leads to everything else. */
export const TABS: { key: string; label: string; icon: IconComponent }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'taskboard', label: 'Taskboard', icon: ListTodo },
  { key: 'backlog', label: 'Backlog', icon: SquareStack },
  { key: 'timeline', label: 'Timeline', icon: ChartNoAxesGantt },
  { key: 'settings', label: 'Settings', icon: SlidersVertical },
];

/** The project's settings, each its own page under Settings (route names `settings/<key>`). */
export const PROJECT_SETTINGS: SidebarItem[] = [
  { key: 'settings/details', label: 'Details', icon: Pencil, href: '/main/settings/details' },
  { key: 'settings/sprints', label: 'Sprints', icon: CalendarDays, href: '/main/settings/sprints' },
  {
    key: 'settings/notifications',
    label: 'Notifications',
    icon: Bell,
    href: '/main/settings/notifications',
  },
];

/** The sidebar's items that have no tab; on phones the Settings screen lists them. */
export const ADMIN_ITEMS: SidebarItem[] = SECTIONS.flatMap((section) => section.items).filter(
  (item) => item.key !== 'settings' && !TABS.some((tab) => tab.key === item.key),
);

/** Route names reached through Settings, so its tab stays marked and they lead back to it. */
export const SETTINGS_KEYS = [...PROJECT_SETTINGS, ...ADMIN_ITEMS].map((item) => item.key);
