import { Stepper } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'UI/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: `Progress through a multi-step flow. Earlier steps show a check, the current one is brand, later ones are outlined. \`compact\` swaps the circles for progress bars on small screens.

\`\`\`tsx
import { Stepper } from '@sprintstack/ui';

<Stepper label="Sign-up progress" steps={['Account', 'Verify', 'Secure']} current={1} />
\`\`\``,
      },
    },
  },
  args: { label: 'Sign-up progress', steps: ['Account', 'Verify', 'Secure'], current: 0 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className="grid max-w-xl gap-8">
      <Stepper {...args} current={0} />
      <Stepper {...args} current={1} />
      <Stepper {...args} current={2} />
      <Stepper {...args} current={1} compact />
    </div>
  ),
};

/** The current step is marked for assistive tech, and done steps say so in words. */
export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { current: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Sign-up progress' });
    const steps = within(list).getAllByRole('listitem');
    await expect(steps).toHaveLength(3);
    await expect(steps[0]).toHaveTextContent('Account (done)');
    await expect(steps[1]).toHaveAttribute('aria-current', 'step');
    await expect(steps[2]).not.toHaveAttribute('aria-current');
  },
};
