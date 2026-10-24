import { Field, Select } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Clock, Equal, Flag, Trash2 } from 'lucide-react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

const sortOptions = (onClear?: () => void) => [
  { value: 'recent', label: 'Most recent', icon: Clock },
  { value: 'rel', label: 'Relevance', icon: Equal },
  { value: 'prio', label: 'Highest priority', icon: Flag },
  { value: 'due', label: 'Due date', icon: Calendar, disabled: true },
  { value: 'clear', label: 'Clear this view', icon: Trash2, danger: true, action: onClear },
];

const statusOptions = [
  { value: 'todo', status: 'neutral' as const },
  { value: 'progress', status: 'info' as const },
  { value: 'review', status: 'review' as const },
  { value: 'done', status: 'success' as const },
  { value: 'blocked', status: 'danger' as const },
];

const people = [
  { value: 'sam', label: 'Sam Park', avatar: 'SP', description: '4 issues' },
  { value: 'ana', label: 'Ana Lopez', avatar: 'AL', description: '7 issues' },
  { value: 'kim', label: 'Kim Jansen', avatar: 'KJ', description: '2 issues' },
];

const meta = {
  title: 'UI/Select',
  component: Select,
  args: { options: sortOptions(), placeholder: 'Choose an order', onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/Select.html (menu open on the first). */
export const States: Story = {
  parameters: { singleTheme: false },
  render: () => (
    <div className="grid max-w-3xl gap-5 pb-80 md:grid-cols-2">
      <Field label="Sort by">
        <Select defaultValue="recent" defaultOpen options={sortOptions()} />
      </Field>
      <Field label="Status">
        <Select defaultValue="review" options={statusOptions} />
      </Field>
    </div>
  ),
};

export const More: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Assignee">
        <Select placeholder="Unassigned" options={people} />
      </Field>
      <Field label="Assignee">
        <Select defaultValue="ana" options={people} />
      </Field>
      <Field label="Sprint" error="Choose a sprint before starting">
        <Select
          placeholder="Choose a sprint"
          options={[{ value: 's24', label: 'Sprint 24' }]}
          invalid
        />
      </Field>
      <Field label="Project" description="Can't change after creation">
        <Select defaultValue="pay" options={[{ value: 'pay', label: 'Payments' }]} disabled />
      </Field>
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  args: { onValueChange: fn(), onClear: fn() } as never,
  render: (args) => {
    const { onValueChange, onClear } = args as unknown as {
      onValueChange: () => void;
      onClear: () => void;
    };
    return (
      <Field label="Sort by">
        <Select
          defaultValue="recent"
          options={sortOptions(onClear)}
          onValueChange={onValueChange}
        />
      </Field>
    );
  },
  play: async ({ args, canvasElement }) => {
    const { onValueChange, onClear } = args as unknown as {
      onValueChange: ReturnType<typeof fn>;
      onClear: ReturnType<typeof fn>;
    };
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Sort by' });
    await expect(trigger).toHaveTextContent('Most recent');

    // Enter opens; arrows move; the disabled row is skipped; Enter picks.
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const listbox = await screen.findByRole('listbox');
    await waitFor(() =>
      expect(within(listbox).getByRole('option', { name: 'Most recent' })).toHaveFocus(),
    );
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(trigger).toHaveTextContent('Highest priority'));
    await expect(onValueChange).toHaveBeenLastCalledWith('prio');

    // Escape closes without changing; the action row runs instead of selecting.
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Clear this view' }));
    await expect(onClear).toHaveBeenCalledOnce();
    await expect(trigger).toHaveTextContent('Highest priority');
  },
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <Field label="Status" description="Moves the issue on the board">
      <Select defaultValue="review" options={statusOptions} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Status' });
    await expect(trigger).toHaveAccessibleDescription('Moves the issue on the board');
    // Status-only options are read by their word.
    await userEvent.click(trigger);
    await expect(await screen.findByRole('option', { name: 'In review' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(screen.getByRole('option', { name: 'Blocked' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};
