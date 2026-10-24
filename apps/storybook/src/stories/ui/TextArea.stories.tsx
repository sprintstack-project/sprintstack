import { Field, TextArea } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/TextArea',
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component: `The multi-line field. Grows with its content up to 320px. With \`maxLength\` it shows a counter; past the limit the counter turns red and the field is invalid, but the text is never cut off.

\`\`\`tsx
import { Field, TextArea } from '@sprintstack/ui';

<Field label="Release note" description="Visible to customers">
  <TextArea value={note} onChange={setNote} maxLength={140} rows={4} />
</Field>
\`\`\``,
      },
    },
  },
  args: { placeholder: 'Steps to reproduce, expected and actual result', onChange: fn() },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/TextArea.html, plus over-limit and disabled. */
export const States: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Description">
        <TextArea placeholder="Steps to reproduce, expected and actual result" />
      </Field>
      <Field label="Release note" description="Visible to customers">
        <TextArea
          maxLength={140}
          defaultValue="Expired saved cards now prompt for an update instead of failing at checkout."
        />
      </Field>
      <Field label="Summary" error="Keep it to 40 characters or fewer">
        <TextArea
          maxLength={40}
          rows={2}
          defaultValue="Checkout fails for every saved card on iOS"
        />
      </Field>
      <Field label="Resolution" description="Locked once the issue is closed">
        <TextArea rows={2} defaultValue="Fixed in 4.12" disabled />
      </Field>
    </div>
  ),
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="grid max-w-md gap-5">
      <Field label="Release note">
        <TextArea maxLength={10} onChange={args.onChange} />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const note = canvas.getByRole('textbox', { name: 'Release note' });

    await userEvent.tab();
    await expect(note).toHaveFocus();
    await userEvent.keyboard('Line one{Enter}two');
    await expect(note).toHaveValue('Line one\ntwo');
    await expect(args.onChange).toHaveBeenLastCalledWith('Line one\ntwo');

    // Never truncates: past the limit the text stays, the counter turns red and the field is invalid.
    await expect(canvas.getByText(/12 \/ 10/)).toHaveAttribute('data-over');
    await expect(note).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <Field label="Release note" description="Visible to customers">
      <TextArea maxLength={140} defaultValue="Ship it" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const note = canvas.getByRole('textbox', { name: 'Release note' });
    await expect(note.tagName).toBe('TEXTAREA');
    await expect(note).toHaveAccessibleDescription('Visible to customers');
    await expect(canvas.getByText(/7 \/ 140/)).toHaveTextContent('7 / 140 characters');
  },
};
