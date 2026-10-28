import { FilterSelect } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

const sprints = [
  { value: 'sprint-24', label: 'Sprint 24', description: 'Active' },
  { value: 'sprint-23', label: 'Sprint 23', description: 'Closed' },
];

const meta = {
  title: 'UI/FilterSelect',
  component: FilterSelect,
  parameters: {
    docs: {
      description: {
        component: `A toolbar filter: an outlined pill reading "Label Value ⌄" that opens the Select menu. Forms use Select.

\`\`\`tsx
import { FilterSelect } from '@sprintstack/ui';

<FilterSelect label="Sprint" options={sprints} value={sprint} onValueChange={setSprint} />
<FilterSelect label="Status" options={statuses} value={status} onValueChange={setStatus} count={3} />
\`\`\``,
      },
    },
  },
  args: { label: 'Sprint', options: sprints, defaultValue: 'sprint-24', onValueChange: fn() },
} satisfies Meta<typeof FilterSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Sprint' }));
    await userEvent.click(await within(document.body).findByRole('option', { name: /Sprint 23/ }));
    await expect(args.onValueChange).toHaveBeenCalledWith('sprint-23');
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect label="Sprint" options={sprints} defaultValue="sprint-24" />
        <FilterSelect
          label="Type"
          options={[
            { value: 'all', label: 'All' },
            { value: 'bug', label: 'Bug' },
          ]}
          defaultValue="all"
        />
        <FilterSelect
          label="Status"
          options={[
            { value: 'open', label: 'Open' },
            { value: 'review', status: 'review' },
          ]}
          defaultValue="open"
          count={3}
        />
        <FilterSelect label="Assignee" options={[]} placeholder="Anyone" disabled />
      </div>
      <div className="w-80">
        <FilterSelect block label="Sprint" options={sprints} defaultValue="sprint-24" />
      </div>
    </div>
  ),
};
