import type { Meta, StoryObj } from '@storybook/react-native';
import Eyebrow from '@ui/eyebrow';

const meta = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
  args: { children: 'Administration', heading: true },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
