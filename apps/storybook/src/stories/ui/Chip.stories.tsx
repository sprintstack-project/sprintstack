import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from '@ui/badge';
import Button from '@ui/button';
import Chip from '@ui/chip';
import Priority from '@ui/priority';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component: `Filter pills (\`toggle\`), value pills (optionally removable), status badges and priority marks. Status is always a word, never colour alone.

\`\`\`tsx
import Badge from '@ui/badge';
import Chip from '@ui/chip';
import Priority from '@ui/priority';

<Chip toggle pressed={mine} onPressedChange={setMine}>Assigned to me</Chip>
<Chip tone="ink" onRemove={() => removeLabel('ios')}>iOS</Chip>
<Badge tone="in_review" />          {/* IN REVIEW */}
<Priority level="high" />
\`\`\``,
      },
    },
  },
  args: { children: 'Payments' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Chip from '@ui/chip';

          <Chip>Payments</Chip>
        `,
      },
    },
  },
};

/** Same states as design-system/reference/previews/Chip.html. */
export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Badge from '@ui/badge';
          import Button from '@ui/button';
          import Chip from '@ui/chip';
          import Priority from '@ui/priority';

          // Filter pills, with "Clear" as a link at the end
          <Chip toggle pressed={bugsOnly} onPressedChange={setBugsOnly}>Bugs</Chip>
          <Chip toggle defaultPressed>Assigned to me</Chip>
          <Chip toggle count={3}>Blocked</Chip>
          <Button variant="link" onClick={clearFilters}>Clear</Button>

          // Value pills
          <Chip>Payments</Chip>
          <Chip tone="ink">Sprint 24</Chip>
          <Chip tone="outline">iOS</Chip>
          <Chip onRemove={() => removeLabel('tech-debt')}>Tech debt</Chip>
          <Chip tone="ink" avatar="SP" onRemove={() => removeAssignee('sam')}>
            Sam Park
          </Chip>
          <Chip tone="accent">Overdue</Chip>
          <Chip tone="key">PAY-1482</Chip>

          // Status badges: no children shows the status word
          <Badge tone="blocked">New</Badge>
          <Badge tone="todo" />
          <Badge tone="in_progress" />
          <Badge tone="in_review" />
          <Badge tone="done" />
          <Badge tone="blocked" />
          <Badge tone="warning" />

          // Priority marks
          <Priority level="highest" />
          <Priority level="high" />
          <Priority level="medium" />
          <Priority level="low" />
        `,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Filter pills scroll sideways above lists, with "Clear" as a red link at the end. */}
      <div className="-mx-1 flex items-center gap-2.5 overflow-x-auto px-1 py-1">
        <Chip toggle>Bugs</Chip>
        <Chip toggle>Stories</Chip>
        <Chip toggle defaultPressed>
          Assigned to me
        </Chip>
        <Chip toggle>Due this week</Chip>
        <Chip toggle count={3}>
          Blocked
        </Chip>
        <Button variant="link">Clear</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Chip>Payments</Chip>
        <Chip tone="ink">Sprint 24</Chip>
        <Chip tone="outline">iOS</Chip>
        <Chip onRemove={() => {}}>Tech debt</Chip>
        <Chip tone="ink" avatar="SP" onRemove={() => {}}>
          Sam Park
        </Chip>
        <Chip tone="accent">Overdue</Chip>
        <Chip tone="key">PAY-1482</Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge tone="blocked">New</Badge>
        <Badge tone="todo" />
        <Badge tone="in_progress" />
        <Badge tone="in_review" />
        <Badge tone="done" />
        <Badge tone="blocked" />
        <Badge tone="warning" />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Priority level="highest" />
        <Priority level="high" />
        <Priority level="medium" />
        <Priority level="low" />
      </div>
    </div>
  ),
};

const RemovableChips = ({ onRemove }: { onRemove: (label: string) => void }) => {
  const [labels, setLabels] = useState(['Tech debt', 'iOS']);
  return (
    <div className="flex gap-2">
      {labels.map((label) => (
        <Chip
          key={label}
          onRemove={() => {
            onRemove(label);
            setLabels((all) => all.filter((l) => l !== label));
          }}
        >
          {label}
        </Chip>
      ))}
    </div>
  );
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { onPressedChange: fn() },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Chip toggle onPressedChange={args.onPressedChange}>
          Bugs
        </Chip>
        <Chip toggle count={3}>
          Blocked
        </Chip>
      </div>
      <RemovableChips onRemove={() => {}} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const bugs = canvas.getByRole('button', { name: 'Bugs' });

    await userEvent.tab();
    await expect(bugs).toHaveFocus();
    await expect(bugs).toHaveAttribute('aria-pressed', 'false');
    await userEvent.keyboard(' ');
    await expect(bugs).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard('{Enter}');
    await expect(bugs).toHaveAttribute('aria-pressed', 'false');

    // Tab moves on to the next pill, then to each remove button.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Blocked 3' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Remove Tech debt' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByText('Tech debt')).toBeNull();
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="flex gap-2">
      <Badge tone="in_review" />
      <Chip tone="done" dot>
        Done
      </Chip>
      <Priority level="high" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Status is always a word, never colour alone.
    await expect(canvas.getByText('In review')).toBeInTheDocument();
    await expect(canvas.getByText('Done')).toBeInTheDocument();
    await expect(canvas.getByText('High')).toBeInTheDocument();
    await expect(getComputedStyle(canvas.getByText('In review')).textTransform).toBe('uppercase');
  },
};
