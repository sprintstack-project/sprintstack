import type { Meta, StoryObj } from '@storybook/react-native';
import Button from '@ui/button';
import Dialog from '@ui/dialog';
import Field from '@ui/field';
import Input from '@ui/input';
import Text from '@ui/text';
import { useState } from 'react';
import { View } from 'react-native';
import { fn } from 'storybook/test';

// A centred panel over a scrim, drawn like a dashboard widget. Renders into the app root's <PortalHost />.
const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  args: { open: false, onOpenChange: fn(), title: 'Delete sprint', children: undefined },
  // Content is built here rather than passed as args: elements in native args crash Storybook.
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
          <Text className="text-[1.0625rem] leading-6 font-semibold text-ink-muted">
            Its 34 work items move back to the backlog. This can’t be undone.
          </Text>
          <View className="mt-6 flex-row flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => close(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => close(false)}>
              Delete sprint
            </Button>
          </View>
        </Dialog>
      </>
    );
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithForm: Story = {
  args: { title: 'Rename sprint' },
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
          <View className="mt-6 flex-row flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </View>
        </Dialog>
      </>
    );
  },
};
