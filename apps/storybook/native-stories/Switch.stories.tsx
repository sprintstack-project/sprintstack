import { Switch, Text } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  args: { label: 'A work item is created', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      {[
        { label: 'Start the next sprint automatically', defaultChecked: true },
        { label: 'Carry over unfinished work' },
        { label: 'Managed by your organisation', defaultChecked: true, disabled: true },
      ].map((row) => (
        <View key={row.label} className="flex-row items-center gap-4">
          <Text className="flex-1 text-[1.0625rem] font-bold text-ink">{row.label}</Text>
          <Switch {...row} />
        </View>
      ))}
    </>
  ),
};
