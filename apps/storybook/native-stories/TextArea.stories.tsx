import { Field, TextArea } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/TextArea',
  component: TextArea,
  args: {
    placeholder: 'Steps to reproduce, expected and actual result',
    maxLength: 140,
    onChange: fn(),
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Description">
        <TextArea placeholder="Steps to reproduce, expected and actual result" />
      </Field>
      <Field label="Release note" description="Visible to customers">
        <TextArea
          maxLength={140}
          defaultValue="Expired saved cards now prompt for an update instead of failing at checkout."
        />
      </Field>
      <Field label="Summary" error="Keep it to 40 characters or fewer">
        <TextArea
          rows={2}
          maxLength={40}
          defaultValue="Checkout fails for every saved card on iOS"
        />
      </Field>
      <Field label="Resolution" description="Locked once the issue is closed">
        <TextArea rows={2} defaultValue="Fixed in 4.12" disabled />
      </Field>
    </>
  ),
};
