import { type Option, Sidebar, type SidebarSection, Text } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Columns3,
  House,
  ListTree,
  LogOut,
  Network,
  Rows3,
  Settings,
  ShieldCheck,
  SlidersVertical,
  UserRound,
  Users,
} from 'lucide-react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

// Long enough to search: the project switcher is a combobox.
const projects: Option[] = [
  { value: 'pay', label: 'Payments', avatar: 'PAY', description: 'Scrum' },
  { value: 'ios', label: 'iOS app', avatar: 'IOS', description: 'Kanban' },
  { value: 'web', label: 'Web platform', avatar: 'WEB', description: 'Scrum' },
  { value: 'growth', label: 'Growth', avatar: 'GRO', description: 'Kanban' },
  { value: 'data', label: 'Data pipeline', avatar: 'DAT', description: 'Scrum' },
  { value: 'infra', label: 'Infrastructure', avatar: 'INF', description: 'Kanban' },
];

// A short menu: account choices without search. Action rows run instead of selecting.
const account: Option[] = [
  { value: 'profile', label: 'Profile', icon: UserRound, action: fn() },
  { value: 'preferences', label: 'Preferences', icon: Settings, action: fn() },
  { value: 'sign-out', label: 'Sign out', icon: LogOut, danger: true, action: fn() },
];

const sections: SidebarSection[] = [
  {
    items: [
      { key: 'home', label: 'Home', icon: House },
      { key: 'taskboard', label: 'Taskboard', icon: Columns3 },
      { key: 'backlog', label: 'Backlog', icon: Rows3 },
      { key: 'timeline', label: 'Timeline', icon: ListTree },
      { key: 'team', label: 'Team', icon: Users },
      { key: 'settings', label: 'Project settings', icon: SlidersVertical },
    ],
  },
  {
    title: 'Administration',
    items: [
      { key: 'workflows', label: 'Workflows', icon: Network },
      { key: 'users', label: 'Users & permissions', icon: ShieldCheck },
    ],
  },
];

// Phones and folded foldables get the drawer (tap the toggle); tablets and open foldables get the
// rail; wide windows the full sidebar. Rotate or unfold to see it switch.
const meta = {
  title: 'UI/Sidebar',
  component: Sidebar.Root,
  decorators: [
    // The header's toggle and the sidebar share one provider.
    (Story, { parameters }) => (
      <Sidebar.Provider defaultCollapsed={parameters.defaultCollapsed}>
        <View className="-m-4 h-[44rem] flex-row">
          <Story />
          <View className="min-w-0 flex-1">
            <View className="h-16 flex-row items-center gap-3 border-b border-line px-6">
              <Sidebar.Toggle />
              <Text className="text-meta font-semibold text-ink-muted">Payments / Taskboard</Text>
            </View>
          </View>
        </View>
      </Sidebar.Provider>
    ),
  ],
  args: {
    logo: <Text className="text-[2rem] leading-8 font-extrabold uppercase text-ink">Strata.</Text>,
    logoCollapsed: (
      <Text className="text-[2rem] leading-8 font-extrabold uppercase text-ink">S.</Text>
    ),
    project: {
      code: 'PAY',
      name: 'Payments',
      meta: 'Scrum · 5 members',
      options: projects,
      value: 'pay',
      onValueChange: fn(),
    },
    sections,
    active: 'taskboard',
    user: {
      name: 'Mira Okafor',
      email: 'mira@company.com',
      avatar: 'MO',
      options: account,
      searchable: false,
    },
    onNavigate: fn(),
  },
} satisfies Meta<typeof Sidebar.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Collapsed: Story = {
  parameters: { defaultCollapsed: true },
};
