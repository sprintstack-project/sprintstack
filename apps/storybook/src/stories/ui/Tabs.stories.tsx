import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from '@ui/tabs';
import { Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `One required choice from a few options, as a row of buttons in a grey track; the chosen one is filled with ink. For story points (which can be cleared and have an overflow menu) use \`Segmented\`.

\`\`\`tsx
import Tabs from '@ui/tabs';

<Tabs label="Scale" choices={scales} value={scale} onValueChange={setScale} />
\`\`\``,
      },
    },
  },
  args: {
    label: 'Scale',
    choices: [
      { value: 'weeks', label: 'Weeks' },
      { value: 'months', label: 'Months' },
      { value: 'quarters', label: 'Quarters' },
      { value: 'years', label: 'Years' },
    ],
    value: 'months',
    onValueChange: fn(),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Tabs from '@ui/tabs';
          import { useState } from 'react';

          const scales = [
            { value: 'weeks', label: 'Weeks' },
            { value: 'months', label: 'Months' },
            { value: 'quarters', label: 'Quarters' },
            { value: 'years', label: 'Years' },
          ];

          const TimelineScale = () => {
            const [scale, setScale] = useState('months');
            return <Tabs label="Scale" choices={scales} value={scale} onValueChange={setScale} />;
          };
        `,
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Tabs from '@ui/tabs';
          import { Sparkles, Zap } from 'lucide-react';
          import { useState } from 'react';

          const ShowLevel = () => {
            const [show, setShow] = useState('epics');
            return (
              <Tabs
                label="Show"
                choices={[
                  { value: 'epics', label: 'Epics', icon: Zap },
                  { value: 'features', label: 'Features', icon: Sparkles },
                ]}
                value={show}
                onValueChange={setShow}
              />
            );
          };
        `,
      },
    },
  },
  args: {
    label: 'Show',
    choices: [
      { value: 'epics', label: 'Epics', icon: Zap },
      { value: 'features', label: 'Features', icon: Sparkles },
    ],
    value: 'epics',
  },
};

/** Clicking an option picks it and marks it pressed. */
export const Pick: Story = {
  ...Playground,
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const quarters = canvas.getByRole('button', { name: 'Quarters' });

    await userEvent.click(quarters);
    await expect(quarters).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Months' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith('quarters');
  },
};
