import { Button, EmptyState } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, Clock, PlusIcon } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component: `What a page, view or panel shows when it has nothing in it yet. It draws no box of its own, so put it in the card, table or panel it stands in for.

\`page\` (the default) is a poster title over three stacked bars; \`art\` picks the solid one. \`widget\` is an icon and a short title in a dashed box, for dashboard panels.

\`\`\`tsx
import { Button, EmptyState } from '@sprintstack/ui';

<EmptyState
  eyebrow="Backlog"
  title="Your backlog"
  highlight="is empty"
  art="bottom"
  description="Capture everything the team might work on."
  actions={<Button variant="brand" icon={Plus}>Create a work item</Button>}
/>
\`\`\``,
      },
    },
  },
  args: {
    eyebrow: 'Taskboard',
    title: 'No sprint',
    highlight: 'is running',
    description:
      'The taskboard shows the work in the active sprint. Plan one from the backlog, then start it to see items here.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    actions: (
      <>
        <Button variant="brand" size="lg">
          Plan a sprint
        </Button>
        <Button size="lg" icon={PlusIcon}>
          Create a work item
        </Button>
      </>
    ),
  },
};

export const Art: Story = {
  render: () => (
    <div className="grid gap-4 lg:grid-cols-3">
      {(['top', 'middle', 'bottom'] as const).map((art) => (
        <div key={art} className="rounded-2xl border border-line bg-surface">
          <EmptyState art={art} eyebrow={`art="${art}"`} title="Nothing" highlight="here yet" />
        </div>
      ))}
    </div>
  ),
};

export const Widgets: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4 md:grid-cols-2">
      <EmptyState
        variant="widget"
        icon={Check}
        title="Nothing assigned"
        description="Items assigned to you show up here, soonest due first."
        actions={<Button variant="link">Create a work item</Button>}
      />
      <EmptyState
        variant="widget"
        icon={Clock}
        title="All quiet"
        description="Changes, comments and status moves from your team appear here as they happen."
      />
    </div>
  ),
};

const onPlan = fn();

/** The title reads as one heading, highlight included, and the actions get their clicks. */
export const Accessible: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: {
    actions: (
      <Button variant="brand" onClick={onPlan}>
        Plan a sprint
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'No sprint is running' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Plan a sprint' }));
    await expect(onPlan).toHaveBeenCalledOnce();
  },
};
