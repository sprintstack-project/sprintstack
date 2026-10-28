import { Button, type CommandGroup, CommandPalette } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Columns3, LayoutDashboard, Plus, Rows3, Users } from 'lucide-react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

const groups: CommandGroup[] = [
  {
    title: 'Pages',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, onSelect: fn() },
      { key: 'taskboard', label: 'Taskboard', icon: Columns3, onSelect: fn() },
      { key: 'backlog', label: 'Backlog', icon: Rows3, keywords: ['issues'], onSelect: fn() },
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
    items: [{ key: 'new-issue', label: 'Create issue', icon: Plus, onSelect: fn() }],
  },
];

// A bottom sheet with the search box focused; Return runs the first match.
const meta = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  args: { open: false, onOpenChange: fn(), groups },
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
