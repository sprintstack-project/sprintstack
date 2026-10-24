import { Input as BaseInput } from '@base-ui/react/input';
import { Field } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

// Stand-in control until the Input component lands; swap for <Input> then.
function DemoInput(props: { id?: string; placeholder?: string; defaultValue?: string }) {
  return (
    <BaseInput
      {...props}
      className="field w-full px-4 text-body text-ink outline-none placeholder:text-ink-placeholder"
    />
  );
}

const meta = {
  title: 'UI/Field',
  component: Field,
  args: {
    label: 'Summary',
    description: 'Shown on boards and in notifications',
    children: <DemoInput placeholder="E.g. checkout bug" />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/Field.html. */
export const States: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Summary" required description="Shown on boards and in notifications">
        <DemoInput placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <DemoInput defaultValue="not-an-email" />
      </Field>
    </div>
  ),
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field
        label="Summary"
        required
        htmlFor="summary"
        description="Shown on boards and in notifications"
      >
        <DemoInput id="summary" placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <DemoInput defaultValue="not-an-email" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The asterisk is decorative, so the name is just the label.
    const summary = canvas.getByRole('textbox', { name: 'Summary' });
    await expect(summary).toHaveAttribute('id', 'summary');
    await expect(summary).toHaveAccessibleDescription('Shown on boards and in notifications');
    await expect(summary).not.toHaveAttribute('aria-invalid');

    // The error replaces the description and is announced with the control.
    const email = canvas.getByRole('textbox', { name: 'Reporter email' });
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Enter a valid email address');
    await expect(email).toHaveAttribute('data-invalid');
  },
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field label="Summary">
        <DemoInput />
      </Field>
      <Field label="Reporter email">
        <DemoInput />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('textbox', { name: 'Summary' });
    const email = canvas.getByRole('textbox', { name: 'Reporter email' });

    await userEvent.tab();
    await expect(summary).toHaveFocus();
    await userEvent.keyboard('Checkout bug');
    await expect(summary).toHaveValue('Checkout bug');
    await userEvent.tab();
    await expect(email).toHaveFocus();

    // Clicking a label moves focus to its control.
    await userEvent.click(canvas.getByText('Summary'));
    await expect(summary).toHaveFocus();
  },
};
