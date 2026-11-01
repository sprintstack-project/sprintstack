import { Section, ToggleRow } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

const meta = {
  title: 'UI/Section',
  component: Section,
  args: {
    title: 'Sprints',
    description: 'Applies from the next sprint. Sprint 24 keeps its current dates.',
    phoneDescription: true,
    children: (
      <View>
        <ToggleRow
          title="Carry over unfinished work"
          description="Open items move to the next sprint, not the backlog."
          checked
          onCheckedChange={() => {}}
        />
      </View>
    ),
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
