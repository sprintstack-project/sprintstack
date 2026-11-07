import type { Meta, StoryObj } from '@storybook/react-native';
import Segmented from '@ui/segmented';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Segmented',
  component: Segmented,
  args: { onValueChange: fn() },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <>
      <Segmented {...args} defaultValue={5} />
      <Segmented {...args} defaultValue={21} />
      <Segmented {...args} error="Story points go up to 34. Split anything bigger." />
      <Segmented {...args} defaultValue={3} disabled />
    </>
  ),
};
