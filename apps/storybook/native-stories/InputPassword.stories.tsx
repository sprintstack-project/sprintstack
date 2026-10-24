import { Button, Field, InputPassword } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Eye, EyeOff, Mail, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
  args: { placeholder: 'E.g. checkout bug', onChange: fn() },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <InputPassword
      defaultValue="hunter22"
      slots={{
        right: (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={visible ? EyeOff : Eye}
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide password' : 'Show password'}
          </Button>
        ),
      }}
    />
  );
}

export const States: Story = {
  render: () => (
    <>
      <InputPassword
        pill
        placeholder="E.g. checkout bug"
        slots={{
          left: <Search />,
          right: (
            <Button variant="brand" size="sm">
              Search
            </Button>
          ),
        }}
      />
      <Field label="Summary" required description="Shown on boards and in notifications">
        <InputPassword placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <InputPassword defaultValue="not-an-email" slots={{ left: <Mail /> }} />
      </Field>
      <Field label="Password">
        <PasswordInput />
      </Field>
      <Field label="Search issues">
        <InputPassword />
      </Field>
      <Field label="Project key" description="Set when the project was created">
        <InputPassword defaultValue="PAY" disabled />
      </Field>
    </>
  ),
};
