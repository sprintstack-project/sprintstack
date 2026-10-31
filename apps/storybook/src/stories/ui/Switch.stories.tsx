import { Switch } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `An on/off setting. It draws only the track; the row's title says what it does, so pass that as \`label\`.

\`\`\`tsx
import { Switch } from '@sprintstack/ui';

<Switch label="Carry over unfinished work" checked={carry} onCheckedChange={setCarry} />
\`\`\``,
      },
    },
  },
  args: { label: 'A work item is created', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      {[
        { label: 'Start the next sprint automatically', defaultChecked: true },
        { label: 'Carry over unfinished work' },
        { label: 'Managed by your organisation', defaultChecked: true, disabled: true },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4">
          <span className="text-[1.0625rem] font-bold text-ink font-stretch-semi-condensed">
            {row.label}
          </span>
          <Switch {...row} />
        </div>
      ))}
    </div>
  ),
};

/** Clicking toggles it, and Space works from the keyboard. */
export const Toggle: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'A work item is created' });

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);

    toggle.focus();
    await userEvent.keyboard(' ');
    await expect(toggle).not.toBeChecked();
  },
};
