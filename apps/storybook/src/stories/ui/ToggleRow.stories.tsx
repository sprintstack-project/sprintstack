import type { Meta, StoryObj } from '@storybook/react-vite';
import ToggleRow from '@ui/toggle-row';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/ToggleRow',
  component: ToggleRow,
  parameters: {
    docs: {
      description: {
        component: `A setting that's on or off: its title and what it does, with a \`Switch\` on the right. Each row draws a divider above itself, so stack rows in a plain column.

\`\`\`tsx
import ToggleRow from '@ui/toggle-row';

<ToggleRow
  title="Carry over unfinished work"
  description="Open items move to the next sprint instead of back to the backlog."
  checked={carry}
  onCheckedChange={setCarry}
/>
\`\`\``,
      },
    },
  },
  args: {
    title: 'Carry over unfinished work',
    description: 'Open items move to the next sprint instead of back to the backlog.',
    checked: false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof ToggleRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <div className="flex max-w-xl flex-col">
        <ToggleRow
          {...args}
          checked={checked}
          onCheckedChange={(next) => {
            setChecked(next);
            args.onCheckedChange(next);
          }}
        />
      </div>
    );
  },
};

export const Stacked: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col">
      <ToggleRow
        title="Start the next sprint automatically"
        description="When a sprint ends, the planned one starts at 09:00 on its start day."
        checked
        onCheckedChange={() => {}}
      />
      <ToggleRow
        title="Carry over unfinished work"
        description="Open items move to the next sprint instead of back to the backlog."
        checked={false}
        onCheckedChange={() => {}}
      />
    </div>
  ),
};

/** The switch is named by the row's title, and clicking it reports the change. */
export const Toggle: Story = {
  ...Playground,
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Carry over unfinished work' });

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
  },
};
