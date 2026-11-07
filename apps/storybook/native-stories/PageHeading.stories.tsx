import type { Meta, StoryObj } from '@storybook/react-native';
import PageHeading from '@ui/page-heading';

const meta = {
  title: 'UI/PageHeading',
  component: PageHeading,
  args: { eyebrow: 'Payments · PAY', title: 'Settings' },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAccent: Story = { args: { title: 'Project', accent: 'settings' } };
