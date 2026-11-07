import type { Meta, StoryObj } from '@storybook/react-vite';
import Segmented from '@ui/segmented';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Segmented',
  component: Segmented,
  parameters: {
    docs: {
      description: {
        component: `Story points as a row of toggles on the usual scale; the rarer values (and "No estimate") sit behind "…". Picking the chosen value again clears it. In a form, use \`f.SegmentedField\`.

\`\`\`tsx
import Segmented from '@ui/segmented';

<Segmented value={points} onValueChange={setPoints} />
\`\`\``,
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Segmented from '@ui/segmented';
          import { useState } from 'react';

          // Picking the chosen value again clears it (null).
          const StoryPoints = () => {
            const [points, setPoints] = useState<number | null>(null);
            return <Segmented value={points} onValueChange={setPoints} />;
          };
        `,
      },
    },
  },
  render: (args) => (
    <div className="max-w-sm">
      <Segmented {...args} />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Segmented from '@ui/segmented';

          <Segmented defaultValue={5} />

          // Rarer values sit behind "…"
          <Segmented defaultValue={21} />

          <Segmented error="Story points go up to 34. Split anything bigger." />

          <Segmented defaultValue={3} disabled />
        `,
      },
    },
  },
  render: (args) => (
    <div className="grid max-w-sm gap-8">
      <Segmented {...args} defaultValue={5} />
      <Segmented {...args} defaultValue={21} />
      <Segmented {...args} error="Story points go up to 34. Split anything bigger." />
      <Segmented {...args} defaultValue={3} disabled />
    </div>
  ),
};

/** Pick, pick again to clear, then choose a bigger estimate from "…". */
export const Picking: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: Playground.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const five = canvas.getByRole('button', { name: '5' });

    await userEvent.click(five);
    await expect(five).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(5);

    await userEvent.click(five);
    await expect(five).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);

    await userEvent.click(canvas.getByRole('combobox', { name: 'More story points' }));
    await userEvent.click(await screen.findByRole('option', { name: '21 points' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(21);
  },
};
