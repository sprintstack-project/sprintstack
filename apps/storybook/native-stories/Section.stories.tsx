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
    children: null,
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

// The row is an element, so it stays out of args: inferring arg types walks into an element's
// internals and reaches expo-router's LinkingContext, whose default throws when read.
export const Playground: Story = {
  render: (args) => (
    <Section {...args}>
      <View>
        <ToggleRow
          title="Carry over unfinished work"
          description="Open items move to the next sprint, not the backlog."
          checked
          onCheckedChange={() => {}}
        />
      </View>
    </Section>
  ),
};
