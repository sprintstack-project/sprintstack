import { Stepper } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'UI/Stepper',
  component: Stepper,
  args: { label: 'Sign-up progress', steps: ['Account', 'Verify', 'Secure'], current: 0 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <>
      <Stepper {...args} current={0} />
      <Stepper {...args} current={1} />
      <Stepper {...args} current={2} />
      <Stepper {...args} current={1} compact />
    </>
  ),
};
