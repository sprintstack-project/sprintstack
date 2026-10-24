import { Field, MultiSelect } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

const labels = [
  { value: 'payments', label: 'Payments' },
  { value: 'ios', label: 'iOS' },
  { value: 'web', label: 'Web' },
  { value: 'debt', label: 'Tech debt' },
];

const people = [
  { value: 'mo', label: 'Mira Okafor', avatar: 'MO' },
  { value: 'jl', label: 'Jonas Lehmann', avatar: 'JL' },
  { value: 'ar', label: 'Aiko Raines', avatar: 'AR' },
];

const components = [
  'Checkout',
  'Payments',
  'Search',
  'Notifications',
  'Onboarding',
  'Settings',
  'Billing',
  'Reports',
  'Admin',
  'Analytics',
  'Accessibility',
  'Localisation',
].map((label) => ({ value: label.toLowerCase(), label }));

const meta = {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  args: { options: labels, placeholder: 'Add labels', onValueChange: fn() },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/MultiSelect.html (menu open on the first). */
export const States: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 pb-72 md:grid-cols-2">
      <Field label="Labels">
        <MultiSelect defaultOpen defaultValue={['payments']} options={labels} />
      </Field>
      <Field label="Assignees">
        <MultiSelect defaultValue={['mo', 'jl']} placeholder="Add people" options={people} />
      </Field>
    </div>
  ),
};

const searchComponents = async (query: string) => {
  await new Promise((r) => setTimeout(r, 300));
  return components.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
};

export const More: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Components" description="Collapses after two rows until focused">
        <MultiSelect
          defaultValue={components.slice(0, 10).map((c) => c.value)}
          options={components}
        />
      </Field>
      <Field label="Labels" description="Grey pills; type to create a new label">
        <MultiSelect
          chipTone="neutral"
          creatable
          defaultValue={['ios']}
          options={labels}
          placeholder="Add labels"
        />
      </Field>
      <Field label="Components" description="Searched as you type">
        <MultiSelect loadOptions={searchComponents} options={[]} placeholder="Search components" />
      </Field>
      <Field label="Reviewers" error="Pick at most 2 reviewers">
        <MultiSelect max={2} defaultValue={['mo', 'jl']} options={people} invalid />
      </Field>
      <Field label="Labels" description="Locked while the sprint runs">
        <MultiSelect chipTone="outline" defaultValue={['web']} options={labels} disabled />
      </Field>
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="pb-72">
      <Field label="Labels">
        <MultiSelect
          creatable
          options={labels}
          placeholder="Add labels"
          onValueChange={args.onValueChange}
        />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Labels' });

    // Type to filter; Enter picks and the menu stays open for the next pick.
    await userEvent.click(input);
    await userEvent.keyboard('io');
    // Matches come first; creatable adds a "Create" row for text that isn't an exact label.
    await waitFor(() =>
      expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
        'iOS',
        'Create "io"',
      ]),
    );
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['ios']));
    await expect(canvas.getByRole('button', { name: 'Remove iOS' })).toBeInTheDocument();

    // creatable: a new label becomes a pill.
    await userEvent.clear(input);
    await userEvent.keyboard('Flaky');
    await userEvent.click(await screen.findByRole('option', { name: 'Create "Flaky"' }));
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['ios', 'Flaky']));

    // Backspace in an empty input removes the last pill.
    await userEvent.clear(input);
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['ios']));
  },
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <div className="pb-72">
      <Field label="Reviewers" description="Up to two people">
        <MultiSelect max={2} defaultValue={['mo', 'jl']} options={people} />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Reviewers' });
    await expect(input).toHaveAccessibleDescription('Up to two people');
    await expect(canvas.getByRole('button', { name: 'Remove Mira Okafor' })).toBeInTheDocument();

    // At the limit, unpicked rows are disabled and the menu says why.
    await userEvent.click(input);
    await expect(await screen.findByRole('option', { name: /Aiko Raines/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(screen.getByText('You can pick up to 2.')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

const manyComponents = Array.from({ length: 1000 }, (_, i) => ({
  value: `c${i}`,
  label: `Component ${i + 1}`,
}));

/** Rows are virtualized: 1,000 options render only what's visible. */
export const LongList: Story = {
  parameters: { singleTheme: true },
  args: { onValueChange: fn() },
  render: (args) => (
    <div className="pb-[28rem]">
      <Field label="Components">
        <MultiSelect
          options={manyComponents}
          placeholder="Add components"
          onValueChange={args.onValueChange}
        />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Components' });
    await userEvent.click(input);
    const listbox = await screen.findByRole('listbox');
    await waitFor(() => expect(within(listbox).getAllByRole('option').length).toBeGreaterThan(3));
    await expect(within(listbox).getAllByRole('option').length).toBeLessThan(40);

    for (let i = 0; i < 25; i++) await userEvent.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Component 25' })).toHaveAttribute(
        'data-highlighted',
      ),
    );
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['c24']));

    await userEvent.keyboard('Component 1000');
    await userEvent.click(await screen.findByRole('option', { name: 'Component 1000' }));
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith(['c24', 'c999']));
  },
};
