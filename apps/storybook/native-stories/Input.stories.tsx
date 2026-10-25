import { Button, Field, Input } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Eye, EyeOff, Mail, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { placeholder: 'E.g. checkout bug', onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const PasswordInput = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      type={visible ? 'text' : 'password'}
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
};

const ClearableInput = () => {
  const [value, setValue] = useState('Checkout');
  return (
    <Input
      type="search"
      value={value}
      onChange={setValue}
      slots={{
        left: <Search />,
        right: value ? (
          <Button variant="ghost" size="sm" iconOnly icon={X} onClick={() => setValue('')}>
            Clear search
          </Button>
        ) : null,
      }}
    />
  );
};

export const States: Story = {
  render: () => (
    <>
      <Input
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
        <Input placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <Input type="email" defaultValue="not-an-email" slots={{ left: <Mail /> }} />
      </Field>
      <Field label="Password">
        <PasswordInput />
      </Field>
      <Field label="Search issues">
        <ClearableInput />
      </Field>
      <Field label="Project key" description="Set when the project was created">
        <Input defaultValue="PAY" disabled />
      </Field>
    </>
  ),
};
