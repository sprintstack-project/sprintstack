import { Button, EmptyState } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Check, Clock, Plus } from 'lucide-react-native';
import { View } from 'react-native';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: {
    eyebrow: 'Taskboard',
    title: 'No sprint',
    highlight: 'is running',
    description:
      'The board shows work in the active sprint. Plan one from the backlog, then start it.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Elements stay out of args: inferring arg types walks into them and throws (see Sidebar.stories).
export const Playground: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      actions={
        <>
          <Button variant="brand" size="lg" block>
            Plan a sprint
          </Button>
          <Button size="lg" icon={Plus} block>
            Create a work item
          </Button>
        </>
      }
    />
  ),
};

export const Art: Story = {
  render: () => (
    <>
      {(['top', 'middle', 'bottom'] as const).map((art) => (
        <View key={art} className="rounded-2xl border border-line bg-surface">
          <EmptyState art={art} eyebrow={`art="${art}"`} title="Nothing" highlight="here yet" />
        </View>
      ))}
    </>
  ),
};

export const Widgets: Story = {
  render: () => (
    <>
      <EmptyState
        variant="widget"
        icon={Check}
        title="Nothing assigned"
        description="Your next items show up here."
      />
      <EmptyState
        variant="widget"
        icon={Clock}
        title="All quiet"
        description="Team activity appears here."
      />
    </>
  ),
};
