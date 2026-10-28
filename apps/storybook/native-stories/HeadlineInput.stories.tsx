import { HeadlineInput } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/HeadlineInput',
  component: HeadlineInput,
  args: { label: 'Title', placeholder: 'What needs doing?', onChange: fn() },
} satisfies Meta<typeof HeadlineInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <>
      <HeadlineInput {...args} defaultValue="Let customers download invoices as PDF" />
      <HeadlineInput {...args} error="Add a title. It’s what people scan on the board." />
      <HeadlineInput {...args} defaultValue="Archived item" disabled />
    </>
  ),
};
