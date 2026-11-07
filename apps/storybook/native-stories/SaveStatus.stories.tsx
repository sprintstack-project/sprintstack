import type { Meta, StoryObj } from '@storybook/react-native';
import SaveStatus from '@ui/save-status';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/SaveStatus',
  component: SaveStatus,
  args: { state: 'saved', savedAt: 'just now', onRetry: fn() },
  argTypes: { state: { control: 'select', options: ['saving', 'saved', 'error'] } },
} satisfies Meta<typeof SaveStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <View className="items-start gap-4">
      <SaveStatus state="saving" />
      <SaveStatus state="saved" savedAt="just now" />
      <SaveStatus state="error" onRetry={args.onRetry} />
    </View>
  ),
};
