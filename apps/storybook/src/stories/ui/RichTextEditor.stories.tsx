import { Field, type RichTextDoc, RichTextEditor } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

export const sampleDoc: RichTextDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Saved cards fail at checkout on iOS 18.' }],
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Add a card in Settings' }] },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Pay with it: ' },
                { type: 'text', marks: [{ type: 'code' }], text: 'PAYMENT_DECLINED' },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'Blocks the 4.2 release.' }],
        },
      ],
    },
  ],
};

const meta = {
  title: 'UI/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    docs: {
      description: {
        component: `Issue descriptions and comments. Stores Tiptap JSON on web (Tiptap) and native (10tap-editor). It keeps its own state while you type; a new \`value\` from outside (like \`form.reset\` after data loads) replaces the content, with no \`key\` needed.

\`\`\`tsx
import { Field, RichTextEditor, richTextToPlainText } from '@sprintstack/ui';

<Field label="Description">
  <RichTextEditor value={doc} onChange={setDoc} placeholder="Steps to reproduce" />
</Field>

const preview = richTextToPlainText(doc); // for search and notifications
\`\`\``,
      },
    },
  },
  args: { placeholder: 'Steps to reproduce, expected and actual result', onChange: fn() },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-5 md:grid-cols-2">
      <Field label="Description">
        <RichTextEditor placeholder="Steps to reproduce, expected and actual result" />
      </Field>
      <Field label="Description" description="Visible to everyone on the project">
        <RichTextEditor defaultValue={sampleDoc} />
      </Field>
      <Field label="Description" error="Describe the issue">
        <RichTextEditor minRows={3} invalid />
      </Field>
      <Field label="Resolution" description="Locked once the issue is closed">
        <RichTextEditor minRows={3} defaultValue={sampleDoc} disabled />
      </Field>
    </div>
  ),
};

/** A value from outside (here, a "Load" button) replaces the content without remounting. */
const Loader = () => {
  const [doc, setDoc] = useState<RichTextDoc | null>(null);
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <button type="button" className="link self-start" onClick={() => setDoc(sampleDoc)}>
        Load saved description
      </button>
      <Field label="Description">
        <RichTextEditor value={doc} onChange={setDoc} placeholder="Nothing yet" />
      </Field>
    </div>
  );
};

export const ExternalValue: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => <Loader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const editor = await canvas.findByRole('textbox', { name: 'Description' });
    await expect(editor).toHaveTextContent('');
    await userEvent.click(canvas.getByRole('button', { name: 'Load saved description' }));
    await waitFor(() => expect(editor).toHaveTextContent('Saved cards fail at checkout'));
    // Still the same element: no remount.
    await expect(canvas.getByRole('textbox', { name: 'Description' })).toBe(editor);
  },
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { onChange: fn(), onBlur: fn() },
  render: (args) => (
    <div className="flex max-w-xl flex-col gap-3">
      <Field label="Description" description="Markdown shortcuts work too">
        <RichTextEditor onChange={args.onChange} onBlur={args.onBlur} />
      </Field>
      <input aria-label="Next field" className="field px-4" />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const editor = await canvas.findByRole('textbox', { name: 'Description' });
    await expect(editor).toHaveAccessibleDescription('Markdown shortcuts work too');

    await userEvent.click(editor);
    await userEvent.keyboard('Steps ');
    // Toolbar toggles keep focus in the editor and show their state.
    const bold = canvas.getByRole('button', { name: 'Bold' });
    await userEvent.click(bold);
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('first');
    await waitFor(() => expect(editor.querySelector('strong')).toHaveTextContent('first'));
    await expect(args.onChange).toHaveBeenCalled();

    // Markdown shortcut: "- " starts a list.
    await userEvent.keyboard('{Enter}- item');
    await waitFor(() => expect(editor.querySelector('ul li')).toHaveTextContent('item'));

    // Leaving the editor reports blur (for validate-on-blur).
    await userEvent.click(canvas.getByRole('textbox', { name: 'Next field' }));
    await expect(args.onBlur).toHaveBeenCalled();
  },
};
