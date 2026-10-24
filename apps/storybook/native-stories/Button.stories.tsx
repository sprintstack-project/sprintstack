import { Button } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ArrowRight, Bookmark, Plus, Trash2 } from 'lucide-react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { children: 'Create issue', variant: 'primary', size: 'md', onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'brand', 'secondary', 'danger', 'ghost', 'link'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// React Native children stretch in a column; a row lets the button size to its label, as on web.
export const Playground: Story = {
  render: (args) => (
    <View className="flex-row">
      <Button {...args} />
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View className="gap-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button variant="primary">Create issue</Button>
        <Button variant="brand">Start sprint</Button>
        <Button>Cancel</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="link">View details</Button>
        <Button disabled>Disabled</Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary">Medium</Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
        <Button variant="brand" iconOnly icon={ArrowRight}>
          Next
        </Button>
        <Button variant="primary" iconOnly icon={Plus}>
          Add
        </Button>
        <Button variant="ghost" iconOnly icon={Bookmark}>
          Watch
        </Button>
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button variant="primary" icon={Plus}>
          Create issue
        </Button>
        <Button variant="danger" icon={Trash2}>
          Delete
        </Button>
        <Button variant="link" iconEnd={ArrowRight}>
          See all
        </Button>
      </View>
    </View>
  ),
};
