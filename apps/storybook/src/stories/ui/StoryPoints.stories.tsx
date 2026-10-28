import { StoryPoints } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/StoryPoints',
  component: StoryPoints,
  parameters: {
    docs: {
      description: {
        component: `Story points as a row of toggles on the usual scale; the rarer values (and "No estimate") sit behind "…". Picking the chosen value again clears it. In a form, use \`f.StoryPointsField\`.

\`\`\`tsx
import { StoryPoints } from '@sprintstack/ui';

<StoryPoints value={points} onValueChange={setPoints} />
\`\`\``,
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof StoryPoints>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <StoryPoints {...args} />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid max-w-sm gap-8">
      <StoryPoints {...args} defaultValue={5} />
      <StoryPoints {...args} defaultValue={21} />
      <StoryPoints {...args} error="Story points go up to 34. Split anything bigger." />
      <StoryPoints {...args} defaultValue={3} disabled />
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
