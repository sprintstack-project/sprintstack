import { Field, Input } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: {
    docs: {
      description: {
        component: `Gives a control its bold label, helper text and red error. Wrap every control in one: Base UI controls link to the label automatically, and the error replaces the helper text.

\`\`\`tsx
import { Field, Input } from '@sprintstack/ui';

<Field label="Reporter email" required description="We'll let them know" error={errors.email}>
  <Input type="email" value={email} onChange={setEmail} onBlur={validate} />
</Field>
\`\`\`

In forms, \`@sprintstack/forms\` renders the Field for you: \`<f.TextField label="Summary" />\`.`,
      },
    },
  },
  args: {
    label: 'Summary',
    description: 'Shown on boards and in notifications',
    children: <Input placeholder="E.g. checkout bug" />,
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
        <Input placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <Input defaultValue="not-an-email" />
      </Field>
    </div>
  ),
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field
        label="Summary"
        required
        htmlFor="summary"
        description="Shown on boards and in notifications"
      >
        <Input id="summary" placeholder="Enter a summary" />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <Input defaultValue="not-an-email" />
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
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field label="Summary">
        <Input />
      </Field>
      <Field label="Reporter email">
        <Input />
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
