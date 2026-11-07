import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from '@ui/progress-bar';
import { expect, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: {
      description: {
        component: `A 3px brand track. Without \`value\` it's indeterminate: put it under the top bar while a page loads. With \`value\` it's determinate, for imports and uploads; \`showValue\` adds the % beside it.

\`\`\`tsx
import ProgressBar from '@ui/progress-bar';

<ProgressBar label="Loading page" />
<ProgressBar label="Importing work items" value={62} showValue />
\`\`\``,
      },
    },
  },
  args: { label: 'Importing work items' },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import ProgressBar from '@ui/progress-bar';

          <ProgressBar label="Importing work items" value={progress} showValue />
        `,
      },
    },
  },
  args: { value: 45, showValue: true },
  argTypes: { value: { control: { type: 'range', min: 0, max: 100 } } },
};

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import ProgressBar from '@ui/progress-bar';

          // Indeterminate: under the top bar while a page loads
          <ProgressBar label="Loading page" />

          // Determinate: imports and uploads, with a % label beside
          <ProgressBar label="Importing work items" value={45} showValue />
        `,
      },
    },
  },
  render: () => (
    <div className="grid max-w-lg gap-8">
      <div className="grid gap-3">
        <ProgressBar label="Loading page" />
        <span className="text-meta text-ink-muted">
          Indeterminate · under the top bar while a page loads
        </span>
      </div>
      <div className="grid gap-3">
        <ProgressBar label="Importing work items" value={45} showValue />
        <span className="text-meta text-ink-muted">
          Determinate · imports and uploads, with a % label beside
        </span>
      </div>
    </div>
  ),
};

/** Determinate bars report their value; indeterminate ones leave it out. */
export const Accessible: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-lg gap-4">
      <ProgressBar label="Loading page" />
      <ProgressBar label="Uploading" value={130} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar', { name: 'Loading page' })).not.toHaveAttribute(
      'aria-valuenow',
    );
    await expect(canvas.getByRole('progressbar', { name: 'Uploading' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  },
};
