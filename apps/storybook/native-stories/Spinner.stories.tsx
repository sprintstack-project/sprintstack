import { Spinner, Text } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  args: { size: 24 },
  argTypes: { size: { control: 'select', options: [16, 20, 24, 40] } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-end gap-6">
      {([16, 20, 24, 40] as const).map((size) => (
        <View key={size} className="gap-2">
          <Spinner size={size} />
          <Text className="text-meta text-ink-muted">{size === 40 ? '40 · page' : size}</Text>
        </View>
      ))}
    </View>
  ),
};

export const LoadMore: Story = {
  render: () => (
    <View className="items-center rounded-xl border border-line bg-surface py-4">
      <Spinner label="Loading 20 more…" />
    </View>
  ),
};
