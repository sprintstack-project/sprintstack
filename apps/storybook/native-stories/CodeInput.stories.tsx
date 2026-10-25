import { CodeInput, Field } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/CodeInput',
  component: CodeInput,
  args: { onChange: fn(), onComplete: fn() },
  render: (args) => (
    <Field label="Authentication code" description="Codes refresh every 30 seconds.">
      <CodeInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Partly filled">
        <CodeInput defaultValue="482" />
      </Field>
      <Field label="Wrong code" error="That code didn’t work. Try the next one.">
        <CodeInput defaultValue="482913" />
      </Field>
      <Field label="Disabled">
        <CodeInput defaultValue="482913" disabled />
      </Field>
    </>
  ),
};
