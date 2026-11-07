import type { Meta, StoryObj } from '@storybook/react-vite';
import Switch from '@ui/switch';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `An on/off setting. It draws only the track; the row's title says what it does, so pass that as \`label\`.

\`\`\`tsx
import Switch from '@ui/switch';

<Switch label="Carry over unfinished work" checked={carry} onCheckedChange={setCarry} />
\`\`\``,
      },
    },
  },
  args: { label: 'A work item is created', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Switch from '@ui/switch';
          import { useState } from 'react';

          const NotifyOnCreate = () => {
            const [on, setOn] = useState(false);
            return <Switch label="A work item is created" checked={on} onCheckedChange={setOn} />;
          };
        `,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Switch from '@ui/switch';

          // It draws only the track: pass the row's title as label.
          <div className="flex items-center justify-between gap-4">
            <span className="text-[1.0625rem] font-bold text-ink font-stretch-semi-condensed">
              Start the next sprint automatically
            </span>
            <Switch label="Start the next sprint automatically" defaultChecked />
          </div>

          <Switch label="Carry over unfinished work" />

          <Switch label="Managed by your organisation" defaultChecked disabled />
        `,
      },
    },
  },
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
