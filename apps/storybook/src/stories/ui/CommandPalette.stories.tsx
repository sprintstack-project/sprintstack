import { Button, type CommandGroup, CommandPalette } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Columns3, LayoutDashboard, Plus, Rows3, SunMoon, Users } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

const groups: CommandGroup[] = [
  {
    title: 'Pages',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onSelect: fn() },
      { key: 'taskboard', label: 'Taskboard', icon: Columns3, onSelect: fn() },
      {
        key: 'backlog',
        label: 'Backlog',
        icon: Rows3,
        keywords: ['issues', 'stories'],
        onSelect: fn(),
      },
      { key: 'team', label: 'Team', icon: Users, keywords: ['people'], onSelect: fn() },
    ],
  },
  {
    title: 'Issues',
    items: [
      {
        key: 'PAY-142',
        label: 'Retry failed card payouts',
        description: 'PAY-142',
        onSelect: fn(),
      },
      { key: 'PAY-118', label: 'Payout webhooks', description: 'PAY-118', onSelect: fn() },
    ],
  },
  {
    title: 'Actions',
    items: [
      { key: 'new-issue', label: 'Create issue', icon: Plus, keywords: ['add'], onSelect: fn() },
      {
        key: 'theme',
        label: 'Switch theme',
        icon: SunMoon,
        keywords: ['dark', 'light'],
        onSelect: fn(),
      },
    ],
  },
];

const meta = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  parameters: {
    docs: {
      description: {
        component: `Search and jump. A dialog with a search box over grouped results; typing filters by label, description and \`keywords\`, the first match stays highlighted, and Enter runs it. Choosing a row closes the palette, then calls its \`onSelect\`. Open it from \`Header\`'s \`search.onOpen\` (the header also binds ⌘K / Ctrl+K).

\`\`\`tsx
const [open, setOpen] = useState(false);

<Header search={{ onOpen: () => setOpen(true) }} … />
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  groups={[
    {
      title: 'Pages',
      items: [{ key: 'backlog', label: 'Backlog', icon: Rows3, onSelect: () => router.push('/backlog') }],
    },
  ]}
/>
\`\`\``,
      },
    },
  },
  args: { open: false, onOpenChange: fn(), groups },
  // Controlled by a button here, as an app's header would.
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Open palette
        </Button>
        <CommandPalette
          {...args}
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            args.onOpenChange(next);
          }}
        />
      </>
    );
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = {
  args: { open: true },
};

export const Interactions: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Open palette' }));
    const search = await body.findByRole('combobox', { name: 'Search or jump to…' });
    await waitFor(() => expect(search).toHaveFocus());

    // Keywords match too: "people" finds Team.
    await userEvent.type(search, 'people');
    await expect(body.getAllByRole('option')).toHaveLength(1);
    await userEvent.keyboard('{Enter}');
    await expect(args.groups[0].items[3].onSelect).toHaveBeenCalled();
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: 'Open palette' }));
    const again = await body.findByRole('combobox', { name: 'Search or jump to…' });
    await expect(again).toHaveValue('');
    await userEvent.type(again, 'zzz');
    await expect(body.getByText('No results for “zzz”')).toBeVisible();
  },
};
