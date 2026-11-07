import type { Meta, StoryObj } from '@storybook/react-vite';
import CodeInput from '@ui/code-input';
import Field from '@ui/field';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/CodeInput',
  component: CodeInput,
  parameters: {
    docs: {
      description: {
        component: `A one-time code shown as one box per digit, built on Base UI's OTP field. Typing moves to the next box, Backspace to the previous one, and paste or the browser's one-time-code autofill fill every box. Wrap it in \`Field\` for its label.

\`\`\`tsx
import CodeInput from '@ui/code-input';
import Field from '@ui/field';

<Field label="Authentication code" description="Codes refresh every 30 seconds.">
  <CodeInput value={code} onChange={setCode} onComplete={verify} />
</Field>
\`\`\``,
      },
    },
  },
  args: { onChange: fn(), onComplete: fn() },
  render: (args) => (
    <div className="max-w-md">
      <Field label="Authentication code" description="Codes refresh every 30 seconds.">
        <CodeInput {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      <Field label="Empty">
        <CodeInput />
      </Field>
      <Field label="Partly filled">
        <CodeInput defaultValue="482" />
      </Field>
      <Field label="Wrong code" error="That code didn’t work. Try the next one.">
        <CodeInput defaultValue="482913" />
      </Field>
      <Field label="Disabled">
        <CodeInput defaultValue="482913" disabled />
      </Field>
    </div>
  ),
};

/** Non-digits are dropped, a pasted code fills every box, and a full code calls onComplete. */
export const Typing: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('textbox', { name: 'Authentication code' });
    const last = canvas.getByRole('textbox', { name: 'Digit 6 of 6' });

    await userEvent.type(first, '4a8');
    await expect(args.onChange).toHaveBeenLastCalledWith('48');

    // Ctrl+Backspace clears every box.
    await userEvent.keyboard('{Control>}{Backspace}{/Control}');
    await expect(args.onChange).toHaveBeenLastCalledWith('');

    await userEvent.click(first);
    await userEvent.paste('123 456 789');
    await expect(first).toHaveValue('1');
    await expect(last).toHaveValue('6');
    await expect(args.onComplete).toHaveBeenCalledWith('123456');
  },
};
