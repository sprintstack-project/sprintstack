import { Field, type RichTextDoc, RichTextEditor } from '@sprintstack/ui';
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
