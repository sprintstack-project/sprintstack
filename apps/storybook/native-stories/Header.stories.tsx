import { Header, type HeaderNotification, Sidebar } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { CalendarClock, LogOut, Moon } from 'lucide-react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const notifications: HeaderNotification[] = [
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
    title: 'Jon Reyes commented on PAY-118',
    description: '“Can we ship this behind a flag?”',
    time: '1h ago',
    avatar: 'JR',
    unread: true,
  },
  {
    id: '3',
    title: 'Sprint 14 starts tomorrow',
    time: 'Yesterday',
    icon: CalendarClock,
  },
];

// Tablets show the trail and search pill. Phones (no sidebar) swap the trail for the project
// switcher and the theme switch for the account menu.
const meta = {
  title: 'UI/Header',
  component: Header,
  decorators: [
    // The toggle reads its state from the sidebar's provider.
    (Story) => (
      <Sidebar.Provider>
        <View className="-m-4">
          <Story />
        </View>
      </Sidebar.Provider>
    ),
  ],
  args: {
    breadcrumbs: [{ label: 'Payments', href: 'payments' }, { label: 'Home' }],
    onNavigate: fn(),
    search: { onOpen: fn() },
    notifications: {
      items: notifications,
      onSelect: fn(),
      onMarkAllRead: fn(),
      onViewAll: fn(),
    },
    theme: 'dark',
    onThemeChange: fn(),
    project: {
      code: 'PAY',
      name: 'Payments',
      options: [
        { value: 'pay', label: 'Payments', avatar: 'PAY', description: 'Scrum' },
        { value: 'ios', label: 'iOS app', avatar: 'IOS', description: 'Kanban' },
      ],
      value: 'pay',
      onValueChange: fn(),
    },
    user: {
      name: 'Mira Okafor',
      avatar: 'MO',
      options: [
        { value: 'theme', label: 'Light theme', icon: Moon, action: fn() },
        { value: 'sign-out', label: 'Sign out', icon: LogOut, danger: true, action: fn() },
      ],
      searchable: false,
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoUnread: Story = {
  args: { notifications: { items: [], onViewAll: fn() } },
};
