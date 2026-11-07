import type { Meta, StoryObj } from '@storybook/react-native';
import Tabs from '@ui/tabs';
import { Moon, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  args: {
    label: 'Send as',
    choices: [
      { value: 'email', label: 'In-app & email' },
      { value: 'in-app', label: 'In-app only' },
    ],
    value: 'email',
    onValueChange: fn(),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
};

export const WithIcons: Story = {
  ...Playground,
  args: {
    label: 'Theme',
    choices: [
      { value: 'dark', label: 'Dark', icon: Moon },
      { value: 'light', label: 'Light', icon: Sun },
    ],
    value: 'light',
  },
};
