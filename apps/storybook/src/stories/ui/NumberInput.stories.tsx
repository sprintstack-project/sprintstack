import { Field, NumberInput } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/NumberInput',
  component: NumberInput,
  args: { defaultValue: 3, min: 0, max: 21, onValueChange: fn() },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/NumberInput.html, plus bounds and disabled. */
export const States: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Story points">
        <NumberInput defaultValue={3} min={0} max={21} />
      </Field>
      <Field label="Capacity" error="Must be 100% or less">
        <NumberInput defaultValue={120} unit="%" invalid />
      </Field>
      <Field label="Sprint length" description="At the minimum, minus is disabled">
        <NumberInput defaultValue={1} min={1} max={4} unit="weeks" />
      </Field>
      <Field label="Estimate" description="Locked after planning">
        <NumberInput defaultValue={5} disabled />
      </Field>
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  render: (args) => (
    <Field label="Story points">
      <NumberInput defaultValue={3} min={0} max={5} onValueChange={args.onValueChange} />
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const points = canvas.getByRole('textbox', { name: 'Story points' });
    const increase = canvas.getByRole('button', { name: 'Increase' });

    // Steppers stay out of the tab order; arrows step the value.
    await userEvent.tab();
    await expect(points).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(points).toHaveValue('5');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(5);
    await expect(increase).toBeDisabled();

    // Out-of-range typed values stay as typed and are flagged.
    await userEvent.clear(points);
    await userEvent.type(points, '8');
    await userEvent.tab();
    await expect(points).toHaveValue('8');
    await expect(points).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <Field label="Capacity" error="Must be 100% or less">
      <NumberInput defaultValue={120} unit="%" invalid />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const capacity = canvas.getByRole('textbox', { name: 'Capacity' });
    await expect(capacity).toHaveAccessibleDescription('Must be 100% or less');
    await expect(canvas.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
  },
};
