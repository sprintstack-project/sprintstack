import { Field, InputPassword } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
  args: { placeholder: 'At least 12 characters', onChange: fn() },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Password">
        <InputPassword placeholder="At least 12 characters" />
      </Field>
      <Field label="Current password" description="The one you use to sign in today">
        <InputPassword defaultValue="hunter22" />
      </Field>
      <Field label="New password" error="Use at least 12 characters">
        <InputPassword defaultValue="short" />
      </Field>
      <Field label="Password" description="Managed by your organisation's sign-on">
        <InputPassword defaultValue="hunter22" disabled />
      </Field>
    </>
  ),
};
