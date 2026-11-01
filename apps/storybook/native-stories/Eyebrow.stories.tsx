import { Eyebrow } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

const meta = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
  args: { children: 'Administration', heading: true },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
