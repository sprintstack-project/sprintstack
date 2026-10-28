import { StoryPoints } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/StoryPoints',
  component: StoryPoints,
  args: { onValueChange: fn() },
} satisfies Meta<typeof StoryPoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <>
      <StoryPoints {...args} defaultValue={5} />
      <StoryPoints {...args} defaultValue={21} />
      <StoryPoints {...args} error="Story points go up to 34. Split anything bigger." />
      <StoryPoints {...args} defaultValue={3} disabled />
    </>
  ),
};
