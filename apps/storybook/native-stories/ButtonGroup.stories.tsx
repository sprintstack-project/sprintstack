import { Button, ButtonGroup } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// The buttons are elements, so they stay out of args: inferring arg types walks into an element's
// internals and reaches expo-router's LinkingContext, whose default throws when read.
export const Playground: Story = {
  args: { children: null },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="brand" size="lg">
        Save changes
      </Button>
      <Button variant="ghost" size="lg">
        Discard
      </Button>
    </ButtonGroup>
  ),
};
