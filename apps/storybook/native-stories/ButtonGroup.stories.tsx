import { Button, ButtonGroup } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  args: {
    children: (
      <>
        <Button variant="brand" size="lg">
          Save changes
        </Button>
        <Button variant="ghost" size="lg">
          Discard
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
