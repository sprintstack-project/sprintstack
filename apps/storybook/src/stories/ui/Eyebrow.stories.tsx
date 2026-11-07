import type { Meta, StoryObj } from '@storybook/react-vite';
import Eyebrow from '@ui/eyebrow';
import { expect, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Eyebrow',
  component: Eyebrow,
  parameters: {
    docs: {
      description: {
        component: `A small uppercase overline. Set \`heading\` when it names the content under it, e.g. a group of settings.

\`\`\`tsx
import Eyebrow from '@ui/eyebrow';

<Eyebrow heading>Administration</Eyebrow>
\`\`\``,
      },
    },
  },
  args: { children: 'Event' },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Eyebrow from '@ui/eyebrow';

          <Eyebrow>Event</Eyebrow>

          // Announced as a heading when it names the content under it
          <Eyebrow heading>Administration</Eyebrow>
        `,
      },
    },
  },
};

/** With `heading`, it's announced as a heading. */
export const AsHeading: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { children: 'Administration', heading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Administration' })).toBeVisible();
  },
};
