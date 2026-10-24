import { Button, Card } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    variant: 'issue',
    issueKey: 'PAY-1482',
    title: 'Checkout fails on saved cards',
    project: 'Payments · iOS',
    priority: 'highest',
    points: 3,
    due: '2 days overdue',
    overdue: true,
    assignee: 'MO',
    age: 'Updated 2h ago',
    onPress: fn(),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Issue: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Card
        variant="issue"
        status="review"
        issueKey="PAY-1477"
        project="Payments"
        title="Add Apple Pay to checkout"
        updated="Updated 2d ago"
        progress={60}
        selected
      />
      <Card variant="tile" tone="ink">
        <Text className="text-poster font-extrabold uppercase text-on-ink">
          Ship it.{'\n'}
          <Text className="text-brand">Sprint 24.</Text>
        </Text>
      </Card>
      <Card variant="tile" tone="brand" eyebrow="Release notes">
        <Text className="text-headline font-extrabold uppercase text-on-brand">v4.2</Text>
      </Card>
      <Card title="Sprint summary" actions={<Button variant="link">Edit</Button>}>
        12 issues, 3 blocked. Velocity is up 8% on last sprint.
      </Card>
    </>
  ),
};
