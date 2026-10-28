import { HeadlineInput } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/HeadlineInput',
  component: HeadlineInput,
  parameters: {
    docs: {
      description: {
        component: `A title written as the page's headline, e.g. a new work item's. One line that wraps; Enter doesn't break it (⌘↵ still bubbles, so a form can submit). The label is the accessible name only. In a form, use \`f.HeadlineField\`.

\`\`\`tsx
import { HeadlineInput } from '@sprintstack/ui';

<HeadlineInput label="Title" placeholder="What needs doing?" value={title} onChange={setTitle} />
\`\`\``,
      },
    },
  },
  args: { label: 'Title', placeholder: 'What needs doing?', onChange: fn() },
} satisfies Meta<typeof HeadlineInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
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
