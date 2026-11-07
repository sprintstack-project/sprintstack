import type { Meta, StoryObj } from '@storybook/react-vite';
import PageHeading from '@ui/page-heading';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'UI/PageHeading',
  component: PageHeading,
  parameters: {
    docs: {
      description: {
        component: `The overline and headline at the top of a page. \`accent\` adds a last word in brand colour.

\`\`\`tsx
import PageHeading from '@ui/page-heading';

<PageHeading eyebrow="Payments · PAY" title="Project" accent="settings" />
\`\`\``,
      },
    },
  },
  args: { eyebrow: 'Payments · PAY', title: 'Project', accent: 'settings' },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The title and accent read as one page heading. */
export const Heading: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Project settings');
  },
};
