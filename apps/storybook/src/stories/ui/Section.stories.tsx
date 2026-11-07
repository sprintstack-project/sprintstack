import type { Meta, StoryObj } from '@storybook/react-vite';
import Section from '@ui/section';
import ToggleRow from '@ui/toggle-row';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'UI/Section',
  component: Section,
  parameters: {
    docs: {
      description: {
        component: `A titled part of a page, e.g. a settings section: its headline and what it's for, then its content. On native phones it drops its frame and headline, since the screen's header names it; \`phoneDescription\` keeps the description.

\`\`\`tsx
import Section from '@ui/section';

<Section title="Sprints" description="Applies from the next sprint.">
  {fields}
</Section>
\`\`\``,
      },
    },
  },
  args: {
    title: 'Sprints',
    description: 'Applies from the next sprint. Sprint 24 keeps its current dates.',
    children: (
      <div className="flex flex-col">
        <ToggleRow
          title="Carry over unfinished work"
          description="Open items move to the next sprint instead of back to the backlog."
          checked
          onCheckedChange={() => {}}
        />
      </div>
    ),
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Its title is a heading, so the page's outline lists it. */
export const Heading: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Sprints' })).toBeVisible();
  },
};
