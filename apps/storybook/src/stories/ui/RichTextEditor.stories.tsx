import type { Meta, StoryObj } from '@storybook/react-vite';
import Field from '@ui/field';
import RichTextEditor from '@ui/rich-text-editor';
import type { MentionItem, RichTextDoc } from '@ui/types';
import { useState } from 'react';
import { expect, fireEvent, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';

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
import Field from '@ui/field';
import RichTextEditor from '@ui/rich-text-editor';
import { richTextToPlainText } from '@lib/rich-text';

<Field label="Description">
  <RichTextEditor value={doc} onChange={setDoc} placeholder="Steps to reproduce" />
</Field>

const preview = richTextToPlainText(doc); // for search and notifications
\`\`\`

The toolbar also adds links, images and emoji. Images can be pasted or dropped in too. Pass \`uploadImage\` to store them and return a URL; without it they're embedded as data URLs.

\`\`\`tsx
<RichTextEditor uploadImage={async (image) => (await api.uploads.create(image)).url} />
\`\`\`

Pass \`searchMentions\` to turn on \`@\` mentions (web only for now). Each one is saved as a \`mention\` node with the person's \`id\` and \`label\`.

\`\`\`tsx
<RichTextEditor searchMentions={(query) => api.members.search(projectId, query)} />
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

const pixel = new File(
  [
    Uint8Array.from(atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), (c) =>
      c.charCodeAt(0),
    ),
  ],
  'pixel.gif',
  { type: 'image/gif' },
);

export const LinksAndImages: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="max-w-xl">
      <Field label="Description">
        <RichTextEditor onChange={args.onChange} />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const editor = await canvas.findByRole('textbox', { name: 'Description' });

    // No selection: the link popover inserts the address as linked text.
    await userEvent.click(editor);
    await userEvent.click(canvas.getByRole('button', { name: 'Link' }));
    await userEvent.type(await body.findByRole('textbox', { name: 'Link address' }), 'example.com');
    await userEvent.click(body.getByRole('button', { name: 'Add link' }));
    await waitFor(() =>
      expect(editor.querySelector('a')).toHaveAttribute('href', 'https://example.com'),
    );

    // Without uploadImage, a picked image is embedded as a data URL.
    const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    if (input) await userEvent.upload(input, pixel);
    await waitFor(() =>
      expect(editor.querySelector('img')?.getAttribute('src')).toMatch(/^data:image\/gif/),
    );

    // Dragging a corner handle resizes the image and saves its width.
    const handle = await waitFor(() => {
      const el = editor.querySelector<HTMLElement>('[data-resize-handle="bottom-right"]');
      if (!el) throw new Error('No resize handle');
      return el;
    });
    fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(document, { clientX: 120, clientY: 120 });
    fireEvent.mouseUp(document, { clientX: 120, clientY: 120 });
    await waitFor(() => {
      const doc = (args.onChange as ReturnType<typeof fn>).mock.lastCall?.[0] as RichTextDoc;
      const image = doc.content?.find((n) => n.type === 'image');
      expect(image?.attrs?.width).toBeGreaterThanOrEqual(48);
    });

    // A plain click edits the link; ⌘/Ctrl-click opens it in a new tab.
    const open = spyOn(window, 'open').mockReturnValue(null);
    const link = editor.querySelector('a') as HTMLAnchorElement;
    await userEvent.click(link);
    await expect(open).not.toHaveBeenCalled();
    fireEvent.click(link, { metaKey: true });
    await expect(open).toHaveBeenCalledWith(
      'https://example.com/',
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
  },
};

const people: MentionItem[] = [
  { id: 'u1', label: 'Ada Lovelace', description: 'Engineering' },
  { id: 'u2', label: 'Grace Hopper', description: 'Platform' },
  { id: 'u3', label: 'Alan Turing', description: 'Research' },
];
const searchPeople = (query: string) =>
  people.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()));

/** `searchMentions` turns on `@` suggestions; the arrow keys and Enter pick one. */
export const Mentions: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="max-w-xl">
      <Field label="Description" description="Type @ to mention someone">
        <RichTextEditor onChange={args.onChange} searchMentions={searchPeople} />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const editor = await canvas.findByRole('textbox', { name: 'Description' });

    await userEvent.click(editor);
    await userEvent.keyboard('Ask @a');
    const list = await body.findByRole('listbox', { name: 'People' });
    await expect(within(list).getAllByRole('option')).toHaveLength(3);

    await userEvent.keyboard('l');
    await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(1));
    await userEvent.keyboard('{Enter}');

    await waitFor(() =>
      expect(editor.querySelector('[data-type="mention"]')).toHaveTextContent('@Alan Turing'),
    );
    await expect(body.queryByRole('listbox', { name: 'People' })).not.toBeInTheDocument();
  },
};
