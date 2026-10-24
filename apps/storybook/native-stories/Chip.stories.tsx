import { Badge, Button, Chip, Priority } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Chip',
  component: Chip,
  args: { children: 'Payments', tone: 'neutral', onPressedChange: fn() },
  argTypes: {
    tone: {
      control: 'select',
      options: [
        'neutral',
        'ink',
        'outline',
        'accent',
        'key',
        'info',
        'review',
        'success',
        'danger',
        'warning',
      ],
    },
    toggle: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <View className="gap-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="items-center gap-2.5"
      >
        <Chip toggle>Bugs</Chip>
        <Chip toggle>Stories</Chip>
        <Chip toggle defaultPressed>
          Assigned to me
        </Chip>
        <Chip toggle count={3}>
          Blocked
        </Chip>
        <Button variant="link">Clear</Button>
      </ScrollView>
      <View className="flex-row flex-wrap items-center gap-2.5">
        <Chip>Payments</Chip>
        <Chip tone="ink">Sprint 24</Chip>
        <Chip tone="outline">iOS</Chip>
        <Chip onRemove={() => {}}>Tech debt</Chip>
        <Chip tone="ink" avatar="SP" onRemove={() => {}}>
          Sam Park
        </Chip>
        <Chip tone="accent">Overdue</Chip>
        <Chip tone="key">PAY-1482</Chip>
      </View>
      <View className="flex-row flex-wrap items-center gap-2.5">
        <Badge tone="danger">New</Badge>
        <Badge tone="neutral" />
        <Badge tone="info" />
        <Badge tone="review" />
        <Badge tone="success" />
        <Badge tone="warning" />
      </View>
      <View className="flex-row flex-wrap items-center gap-5">
        <Priority level="highest" />
        <Priority level="medium" />
        <Priority level="low" />
      </View>
    </View>
  ),
};
