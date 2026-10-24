import { Field, InputPassword } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
  parameters: {
    docs: {
      description: {
        component: `A 56px password field with a show/hide toggle. Wrap it in \`Field\` like every other control.

\`\`\`tsx
import { Field, InputPassword } from '@sprintstack/ui';

<Field label="Password" error={errors.password}>
  <InputPassword value={password} onChange={setPassword} onBlur={validate} />
</Field>
\`\`\``,
      },
    },
  },
  args: { placeholder: 'At least 12 characters', onChange: fn() },
} satisfies Meta<typeof InputPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Password">
        <InputPassword placeholder="At least 12 characters" />
      </Field>
      <Field label="Current password" description="The one you use to sign in today">
        <InputPassword defaultValue="hunter22" />
      </Field>
      <Field label="New password" error="Use at least 12 characters">
        <InputPassword defaultValue="short" />
      </Field>
      <Field label="Password" description="Managed by your organisation's sign-on">
        <InputPassword defaultValue="hunter22" disabled />
      </Field>
    </div>
  ),
};

/** The toggle reveals and hides the text, and is a labelled button. */
export const Toggle: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="grid max-w-md gap-5">
      <Field label="Password">
        <InputPassword onChange={args.onChange} />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');

    await userEvent.type(input, 'hunter22');
    await expect(args.onChange).toHaveBeenLastCalledWith('hunter22');
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveValue('hunter22');

    await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }));
    await expect(input).toHaveAttribute('type', 'password');
  },
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field label="Password">
        <InputPassword />
      </Field>
      <Field label="Managed password">
        <InputPassword defaultValue="hunter22" disabled />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');

    await userEvent.tab();
    await expect(input).toHaveFocus();

    // Tab reaches the toggle; Enter flips it. The disabled field and its toggle are skipped.
    await userEvent.tab();
    const [toggle] = canvas.getAllByRole('button', { name: 'Show password' });
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveAttribute('type', 'text');
    await userEvent.tab();
    await expect(canvas.getByLabelText('Managed password')).not.toHaveFocus();
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field label="New password" error="Use at least 12 characters">
        <InputPassword defaultValue="short" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The toggle's label never leaks into the field's name; the error is announced.
    const input = canvas.getByLabelText('New password');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Use at least 12 characters');
  },
};
