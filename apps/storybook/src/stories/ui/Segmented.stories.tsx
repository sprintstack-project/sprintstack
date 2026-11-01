import { Segmented } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Segmented',
  component: Segmented,
  parameters: {
    docs: {
      description: {
        component: `One required choice from a few options, as a row of buttons in a grey track; the chosen one is filled with ink. For story points (which can be cleared and have an overflow menu) use \`StoryPoints\`.

\`\`\`tsx
import { Segmented } from '@sprintstack/ui';

<Segmented label="Scale" choices={scales} value={scale} onValueChange={setScale} />
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
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Segmented
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
