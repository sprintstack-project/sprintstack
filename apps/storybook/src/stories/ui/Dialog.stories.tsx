import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@ui/button';
import Dialog from '@ui/dialog';
import Field from '@ui/field';
import Input from '@ui/input';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: `A modal panel drawn like a dashboard widget: an uppercase \`title\` with a close button, then your \`children\` (which scroll when tall). Esc, a backdrop click and the close button each call \`onOpenChange(false)\`; focus moves into the dialog and returns to the trigger on close. Native renders into \`<PortalHost />\` from \`@rn-primitives/portal\`, mounted once at the app's root.

\`\`\`tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} title="Delete sprint">
  <p>Its 34 work items move back to the backlog.</p>
  <div className="mt-6 flex justify-end gap-3">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={remove}>Delete sprint</Button>
  </div>
</Dialog>
\`\`\``,
      },
    },
  },
  args: { open: false, onOpenChange: fn(), title: 'Delete sprint', children: undefined },
  // Controlled by a button here, as a page would.
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    const close = (next: boolean) => {
      setOpen(next);
      args.onOpenChange(next);
    };
    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog {...args} open={open} onOpenChange={close}>
          <p className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
            Its 34 work items move back to the backlog. This can’t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => close(false)}>
              Delete sprint
            </Button>
          </div>
        </Dialog>
      </>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { args: { open: true } };

export const WithForm: Story = {
  args: { title: 'Rename sprint' },
  parameters: {
    docs: {
      source: {
        code: code`
          <Dialog open={open} onOpenChange={setOpen} title="Rename sprint">
            <Field label="Name">
              <Input value={name} onChange={setName} />
            </Field>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </Dialog>
        `,
      },
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    const [name, setName] = useState('Sprint 24');
    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Rename sprint
        </Button>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <Field label="Name">
            <Input value={name} onChange={setName} />
          </Field>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </div>
        </Dialog>
      </>
    );
  },
};

export const Interactions: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open dialog' });

    // Named by its title.
    await userEvent.click(trigger);
    await body.findByRole('dialog', { name: 'Delete sprint' });

    // Esc closes it and hands focus back to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());

    // So does the close button.
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
