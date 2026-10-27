import { type Option, Sidebar, type SidebarSection } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
} from 'lucide-react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

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
      { key: 'home', label: 'Home', icon: House, href: '#home' },
      { key: 'taskboard', label: 'Taskboard', icon: Columns3, href: '#taskboard' },
      { key: 'backlog', label: 'Backlog', icon: Rows3, href: '#backlog' },
      { key: 'timeline', label: 'Timeline', icon: ListTree, href: '#timeline' },
      { key: 'team', label: 'Team', icon: Users, href: '#team' },
      { key: 'settings', label: 'Project settings', icon: SlidersVertical, href: '#settings' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { key: 'workflows', label: 'Workflows', icon: Network, href: '#workflows' },
      { key: 'users', label: 'Users & permissions', icon: ShieldCheck, href: '#users' },
    ],
  },
];

const logo = (
  <span className="headline text-[2rem] leading-none">
    Strata<span className="text-brand-ink">.</span>
  </span>
);

const meta = {
  title: 'UI/Sidebar',
  component: Sidebar.Root,
  parameters: {
    docs: {
      description: {
        component: `App navigation. It follows the viewport: a drawer below \`md\`, an icon rail from \`md\` to \`lg\`, and the full sidebar from \`lg\`. \`Sidebar.Toggle\` lives in the page header: it collapses or expands the sidebar (pinning the choice) or, on phones, opens the drawer. Both read their state from \`Sidebar.Provider\`.

The project and account rows are switchers. Give one \`options\` and it opens a combobox, the same menu as \`Select searchable\` (search plus virtualized rows). \`searchable: false\` makes it a short menu, and \`action\` rows (such as "Sign out") run instead of selecting. Without \`options\`, a row is a button that calls \`onPress\`.

\`\`\`tsx
import { Sidebar, type Option, type SidebarSection } from '@sprintstack/ui';
import { Columns3, House, LogOut, ShieldCheck, UserRound } from 'lucide-react';
import Link from 'next/link';

const sections: SidebarSection[] = [
  {
    items: [
      { key: 'home', label: 'Home', icon: House, href: '/' },
      { key: 'taskboard', label: 'Taskboard', icon: Columns3, href: '/taskboard' },
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

<Sidebar.Provider>
  <div className="flex min-h-dvh">
    <Sidebar.Root
      logo={<Logo />}
      logoCollapsed={<Monogram />}
      project={{
        code: 'PAY',
        name: 'Payments',
        meta: 'Scrum · 5 members',
        options: projects,
        value: projectId,
        onValueChange: switchProject,
      }}
      sections={sections}
      active="taskboard"
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
        …
      </header>
      …
    </div>
  </div>
</Sidebar.Provider>
\`\`\``,
      },
    },
  },
  decorators: [
    // The header's toggle and the sidebar share one provider.
    (Story, { parameters }) => (
      <Sidebar.Provider defaultCollapsed={parameters.defaultCollapsed}>
        <div className="-m-8 flex h-[44rem] overflow-hidden">
          <Story />
          <div className="min-w-0 flex-1">
            <header className="flex h-16 items-center gap-3 border-b border-line px-6">
              <Sidebar.Toggle />
              <span className="text-meta text-ink-muted">Payments / Taskboard</span>
            </header>
          </div>
        </div>
      </Sidebar.Provider>
    ),
  ],
  args: {
    logo,
    logoCollapsed: (
      <span className="headline text-[2rem] leading-none">
        S<span className="text-brand-ink">.</span>
      </span>
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

/** Starts collapsed to the rail on every width from `md`; labels move into tooltips. */
export const Collapsed: Story = {
  parameters: { defaultCollapsed: true },
};

/**
 * The header toggle drives whichever layout the viewport gives: the drawer on phones, collapse and
 * expand from `md`. Navigating from the drawer closes it.
 */
export const Toggle: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const toggle = canvas.getByRole('button', { name: 'Sidebar' });

    if (window.matchMedia('(min-width: 48rem)').matches) {
      const nav = canvas.getByRole('navigation', { name: 'Main' });
      await expect(within(nav).getByRole('link', { name: 'Taskboard' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-expanded', String(!expanded));
      return;
    }

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const drawer = await body.findByRole('dialog', { name: 'Main' });
    const nav = within(drawer).getByRole('navigation', { name: 'Main' });
    await expect(within(nav).getByRole('link', { name: 'Taskboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(within(nav).getByRole('list', { name: 'Administration' })).toBeVisible();
    await userEvent.click(within(nav).getByRole('link', { name: 'Backlog' }));
    await expect(args.onNavigate).toHaveBeenCalledWith(expect.objectContaining({ key: 'backlog' }));
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  },
};

/** The project row is a searchable combobox; the account row a short menu with action rows. */
export const Switchers: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    // On phones the switchers live in the drawer.
    if (!window.matchMedia('(min-width: 48rem)').matches) {
      await userEvent.click(canvas.getByRole('button', { name: 'Sidebar' }));
      await body.findByRole('dialog', { name: 'Main' });
    }

    await userEvent.click(body.getByRole('combobox', { name: 'Payments, switch project' }));
    // Opening focuses the search box, named after the row.
    const search = await body.findByPlaceholderText('Search');
    await expect(search).toHaveAccessibleName('Payments, switch project');
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.type(search, 'inf');
    await userEvent.click(await body.findByRole('option', { name: /Infrastructure/ }));
    await expect(args.project?.onValueChange).toHaveBeenCalledWith('infra');

    await userEvent.click(body.getByRole('combobox', { name: 'Mira Okafor, account' }));
    await userEvent.click(await body.findByRole('option', { name: 'Sign out' }));
    await expect(args.user?.options?.[2].action).toHaveBeenCalled();
  },
};
