import type { Meta, StoryObj } from '@storybook/react-vite';
import SaveStatus from '@ui/save-status';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/SaveStatus',
  component: SaveStatus,
  parameters: {
    docs: {
      description: {
        component: `Inline save feedback, next to what changed. Never a modal. The words are a polite status; on error a Retry link follows.

\`\`\`tsx
import SaveStatus from '@ui/save-status';

<SaveStatus state="saving" />
<SaveStatus state="saved" savedAt="just now" />
<SaveStatus state="error" onRetry={save} />
\`\`\``,
      },
    },
  },
  args: { state: 'saved', savedAt: 'just now', onRetry: fn() },
  argTypes: { state: { control: 'inline-radio', options: ['saving', 'saved', 'error'] } },
} satisfies Meta<typeof SaveStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import SaveStatus from '@ui/save-status';

          // Next to what changed, driven by the save mutation
          <SaveStatus
            state={save.isPending ? 'saving' : save.isError ? 'error' : 'saved'}
            savedAt="just now"
            onRetry={() => save.mutate()}
          />
        `,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import SaveStatus from '@ui/save-status';

          <SaveStatus state="saving" />
          <SaveStatus state="saved" savedAt="just now" />
          <SaveStatus state="error" onRetry={save} />
        `,
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <SaveStatus state="saving" />
      <SaveStatus state="saved" savedAt="just now" />
      <SaveStatus state="error" onRetry={args.onRetry} />
    </div>
  ),
};

/** The error says so in words, and Retry calls back. */
export const Retry: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { state: 'error' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Couldn’t save.');
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};
