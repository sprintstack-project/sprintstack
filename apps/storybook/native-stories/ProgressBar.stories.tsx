import type { Meta, StoryObj } from '@storybook/react-native';
import ProgressBar from '@ui/progress-bar';
import Text from '@ui/text';
import { View } from 'react-native';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  args: { label: 'Importing work items', value: 45, showValue: true },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <View className="gap-6">
      <View className="gap-2">
        <ProgressBar label="Loading page" />
        <Text className="text-meta text-ink-muted">Indeterminate · while a page loads</Text>
      </View>
      <View className="gap-2">
        <ProgressBar label="Importing work items" value={45} showValue />
        <Text className="text-meta text-ink-muted">Determinate · imports and uploads</Text>
      </View>
    </View>
  ),
};
