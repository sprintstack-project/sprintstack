import type { Meta, StoryObj } from '@storybook/react-vite';
import HeadlineInput from '@ui/headline-input';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/HeadlineInput',
  component: HeadlineInput,
  parameters: {
    docs: {
      description: {
        component: `A title written as the page's headline, e.g. a new work item's. One line that wraps; Enter doesn't break it (⌘↵ still bubbles, so a form can submit). The label is the accessible name only. In a form, use \`f.HeadlineField\`.

\`\`\`tsx
import HeadlineInput from '@ui/headline-input';

<HeadlineInput label="Title" placeholder="What needs doing?" value={title} onChange={setTitle} />
\`\`\``,
      },
    },
  },
  args: { label: 'Title', placeholder: 'What needs doing?', onChange: fn() },
} satisfies Meta<typeof HeadlineInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import HeadlineInput from '@ui/headline-input';
          import { useState } from 'react';

          const Title = () => {
            const [title, setTitle] = useState('');
            return (
              <HeadlineInput label="Title" placeholder="What needs doing?" value={title} onChange={setTitle} />
            );
          };
        `,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import HeadlineInput from '@ui/headline-input';

          <HeadlineInput
            label="Title"
            placeholder="What needs doing?"
            defaultValue="Let customers download invoices as PDF"
          />

          <HeadlineInput
            label="Title"
            placeholder="What needs doing?"
            error="Add a title. It’s what people scan on the board."
          />

          <HeadlineInput label="Title" defaultValue="Archived item" disabled />
        `,
      },
    },
  },
  render: (args) => (
    <div className="grid max-w-3xl gap-10 pl-6">
      <HeadlineInput {...args} defaultValue="Let customers download invoices as PDF" />
      <HeadlineInput {...args} error="Add a title. It’s what people scan on the board." />
      <HeadlineInput {...args} defaultValue="Archived item" disabled />
    </div>
  ),
};

/** Enter doesn't add a line break; the error is the field's description. */
export const Typing: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { error: 'Add a title. It’s what people scan on the board.' },
  play: async ({ args, canvasElement }) => {
    const title = within(canvasElement).getByRole('textbox', { name: 'Title' });
    await expect(title).toHaveAccessibleDescription(
      'Add a title. It’s what people scan on the board.',
    );
    await userEvent.type(title, 'Invoices{Enter}as PDF');
    await expect(title).toHaveValue('Invoicesas PDF');
    await expect(args.onChange).toHaveBeenLastCalledWith('Invoicesas PDF');
  },
};
