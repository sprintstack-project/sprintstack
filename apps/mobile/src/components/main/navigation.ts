import type { IconComponent, SidebarSection } from '@sprintstack/ui';
import {
  ChartNoAxesGantt,
  Ellipsis,
  LayoutDashboard,
  ListTodo,
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
        key: 'project-settings',
        label: 'Project settings',
        icon: SlidersVertical,
        href: '/main/project-settings',
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

/** The phone tab bar: the main destinations, then More for everything else in the sidebar. */
export const TABS: { key: string; label: string; icon: IconComponent }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'taskboard', label: 'Taskboard', icon: ListTodo },
  { key: 'backlog', label: 'Backlog', icon: SquareStack },
  { key: 'timeline', label: 'Timeline', icon: ChartNoAxesGantt },
  { key: 'more', label: 'More', icon: Ellipsis },
];

/** The sidebar's items that have no tab, grouped as in the sidebar; the More screen lists them. */
export const MORE_SECTIONS: SidebarSection[] = SECTIONS.map((section) => ({
  ...section,
  items: section.items.filter((item) => !TABS.some((tab) => tab.key === item.key)),
})).filter((section) => section.items.length > 0);

/** Route names reached through More, so its tab stays marked on them. */
export const MORE_KEYS = MORE_SECTIONS.flatMap((section) => section.items.map((item) => item.key));
