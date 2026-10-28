import { FilterSelect } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { fn } from 'storybook/test';

const sprints = [
  { value: 'sprint-24', label: 'Sprint 24', description: 'Active' },
  { value: 'sprint-23', label: 'Sprint 23', description: 'Closed' },
];

const meta = {
  title: 'UI/FilterSelect',
  component: FilterSelect,
  args: { label: 'Sprint', options: sprints, defaultValue: 'sprint-24', onValueChange: fn() },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <View className="gap-4">
      <FilterSelect block label="Sprint" options={sprints} defaultValue="sprint-24" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        <FilterSelect
          label="Type"
          options={[
            { value: 'all', label: 'All' },
            { value: 'bug', label: 'Bug' },
          ]}
          defaultValue="all"
        />
        <FilterSelect
          label="Status"
          options={[
            { value: 'open', label: 'Open' },
            { value: 'review', status: 'review' },
          ]}
          defaultValue="open"
          count={3}
        />
        <FilterSelect label="Assignee" options={[]} placeholder="Anyone" disabled />
      </ScrollView>
    </View>
  ),
};
