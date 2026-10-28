import { Header, type HeaderNotification, Sidebar } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarClock } from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

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

const meta = {
  title: 'UI/Header',
  component: Header,
  parameters: {
    docs: {
      description: {
        component: `The page header beside the sidebar: \`Sidebar.Toggle\`, breadcrumbs, a search button that opens \`CommandPalette\` (also ⌘K / Ctrl+K), a notifications dropdown and the theme switch. Every part is optional. Below \`sm\` only the current crumb shows; below \`md\` search shrinks to an icon button.

\`\`\`tsx
import { Header } from '@sprintstack/ui';
import Link from 'next/link';

<Sidebar.Provider>
  …
  <Header
    breadcrumbs={[{ label: 'Payments', href: '/' }, { label: 'Home' }]}
    linkComponent={Link}
    search={{ onOpen: openPalette }}
    notifications={{ items, onSelect: openNotification, onMarkAllRead, onViewAll }}
    theme={theme}
    onThemeChange={setTheme}
  />
</Sidebar.Provider>
\`\`\``,
      },
    },
  },
  decorators: [
    // The toggle reads its state from the sidebar's provider.
    (Story) => (
      <Sidebar.Provider>
        <div className="-m-8">
          <Story />
        </div>
      </Sidebar.Provider>
    ),
  ],
  args: {
    breadcrumbs: [{ label: 'Payments', href: '#payments' }, { label: 'Home' }],
    search: { onOpen: fn() },
    notifications: {
      items: notifications,
      onSelect: fn(),
      onMarkAllRead: fn(),
      onViewAll: fn(),
    },
    theme: 'dark',
    onThemeChange: fn(),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Nothing to show: no dot, and an empty dropdown. */
export const NoUnread: Story = {
  args: { notifications: { items: [], onViewAll: fn() } },
};

/** Just the trail, e.g. for a page without search. */
export const BreadcrumbsOnly: Story = {
  args: {
    toggle: false,
    search: undefined,
    notifications: undefined,
    onThemeChange: undefined,
    breadcrumbs: [
      { label: 'Payments', href: '#payments' },
      { label: 'Backlog', href: '#backlog' },
      { label: 'PAY-142' },
    ],
  },
};

export const Interactions: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Home')).toHaveAttribute('aria-current', 'page');

    await userEvent.click(canvas.getByRole('button', { name: 'Search or jump to…' }));
    await expect(args.search?.onOpen).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await expect(args.search?.onOpen).toHaveBeenCalledTimes(2);

    // The bell opens a dropdown; choosing a notification closes it.
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications, 2 unread' }));
    const body = within(canvasElement.ownerDocument.body);
    const dropdown = await body.findByRole('dialog', { name: 'Notifications' });
    await userEvent.click(within(dropdown).getByRole('button', { name: /assigned you PAY-142/ }));
    await expect(args.notifications?.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
    );
    await waitFor(() => expect(dropdown).not.toBeInTheDocument());

    const themeSwitch = canvas.getByRole('button', { name: 'Dark theme' });
    await expect(themeSwitch).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(themeSwitch);
    await expect(args.onThemeChange).toHaveBeenCalledWith('light');
  },
};
