import type { Meta, StoryObj } from '@storybook/react-native';
import Button from '@ui/button';
import Card from '@ui/card';
import Text from '@ui/text';
import { View } from 'react-native';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: { variant: 'panel' },
  render: (args) => (
    <Card {...args}>
      <Text className="text-[1.0625rem] leading-6 font-semibold text-ink-muted">
        12 issues, 3 blocked. Ends Friday.
      </Text>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Card>
        <View className="flex-row items-start gap-3">
          <Text accessibilityRole="header" className="flex-1 text-title font-extrabold text-ink">
            Sprint summary
          </Text>
          <Button variant="link">Edit</Button>
        </View>
        <Text className="mt-3 text-[1.0625rem] leading-6 font-semibold text-ink-muted">
          12 issues, 3 blocked. Velocity is up 8% on last sprint.
        </Text>
      </Card>
      <Card variant="ink">
        <View className="flex-1" />
        <Text className="text-poster font-extrabold uppercase text-on-ink">
          Ship it.{'\n'}
          <Text className="text-brand">Sprint 24.</Text>
        </Text>
      </Card>
      <Card variant="brand">
        <Text className="text-eyebrow font-bold uppercase text-on-brand">Release notes</Text>
        <View className="flex-1" />
        <Text className="text-headline font-extrabold uppercase text-on-brand">v4.2</Text>
      </Card>
      <Card variant="muted">
        <Text className="text-eyebrow font-bold uppercase text-ink">Career toolkit</Text>
        <View className="flex-1" />
        <Text className="text-headline font-extrabold uppercase text-ink">Reviews</Text>
      </Card>
    </>
  ),
};
