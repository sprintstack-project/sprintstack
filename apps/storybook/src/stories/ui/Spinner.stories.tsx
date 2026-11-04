import { Spinner } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: `A ring in the text colour. 16–24 sit inline (buttons, rows, save status); 40 is the page spinner and the only one in brand. Prefer a skeleton for content; a spinner is for actions and short waits.

With \`label\` it shows the words beside the ring and announces them politely; without, it's decorative.

\`\`\`tsx
import { Spinner } from '@sprintstack/ui';

<Spinner size={40} />
<Spinner size={20} label="Loading 20 more…" />
\`\`\``,
      },
    },
  },
  argTypes: { size: { control: 'inline-radio', options: [16, 20, 24, 40] } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { size: 24 } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8 text-ink-muted">
      {([16, 20, 24, 40] as const).map((size) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <Spinner size={size} />
          <span className="text-meta">{size === 40 ? '40 · page' : size}</span>
        </div>
      ))}
    </div>
  ),
};

/** The bottom of an infinite list while the next page loads. */
export const LoadMore: Story = {
  render: () => (
    <div className="flex max-w-lg justify-center rounded-xl border border-line bg-surface py-4">
      <Spinner label="Loading 20 more…" />
    </div>
  ),
};

/** A labelled spinner is a polite status; a bare one is hidden. */
export const Accessible: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { label: 'Loading 20 more…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading 20 more…');
  },
};
