import { Field, type MentionItem, type RichTextDoc, RichTextEditor } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const sampleDoc: RichTextDoc = {
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
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Pay with it' }] }],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Trace: ' },
        {
          type: 'text',
          marks: [{ type: 'link', attrs: { href: 'https://example.com/trace/4821' } }],
          text: 'checkout #4821',
        },
        { type: 'text', text: ' 🔥 cc ' },
        {
          type: 'mention',
          attrs: { id: 'u2', label: 'Grace Hopper', mentionSuggestionChar: '@' },
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
  args: {
    placeholder: 'Steps to reproduce, expected and actual result',
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Description" description="Visible to everyone on the project">
        <RichTextEditor defaultValue={sampleDoc} />
      </Field>
      <Field label="Description" error="Describe the issue">
        <RichTextEditor minRows={3} placeholder="Steps to reproduce" invalid />
      </Field>
    </>
  ),
};

const people: MentionItem[] = [
  { id: 'u1', label: 'Ada Lovelace', description: 'Engineering' },
  { id: 'u2', label: 'Grace Hopper', description: 'Platform' },
  { id: 'u3', label: 'Alan Turing', description: 'Research' },
];

/** The @ button opens a searchable sheet; picked people show as chips and save as mentions. */
export const Mentions: Story = {
  args: {
    defaultValue: sampleDoc,
    searchMentions: (query: string) =>
      people.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
  },
};
