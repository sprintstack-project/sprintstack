import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterSelect from '@ui/filter-select';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

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
import FilterSelect from '@ui/filter-select';

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
  parameters: {
    docs: {
      source: {
        code: code`
          import FilterSelect from '@ui/filter-select';
          import { useState } from 'react';

          const sprints = [
            { value: 'sprint-24', label: 'Sprint 24', description: 'Active' },
            { value: 'sprint-23', label: 'Sprint 23', description: 'Closed' },
          ];

          const SprintFilter = () => {
            const [sprint, setSprint] = useState<string | null>('sprint-24');
            return <FilterSelect label="Sprint" options={sprints} value={sprint} onValueChange={setSprint} />;
          };
        `,
      },
    },
    singleTheme: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Sprint' }));
    await userEvent.click(await within(document.body).findByRole('option', { name: /Sprint 23/ }));
    await expect(args.onValueChange).toHaveBeenCalledWith('sprint-23');
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import FilterSelect from '@ui/filter-select';

          <FilterSelect label="Sprint" options={sprints} defaultValue="sprint-24" />

          <FilterSelect
            label="Type"
            options={[
              { value: 'all', label: 'All' },
              { value: 'bug', label: 'Bug' },
            ]}
            defaultValue="all"
          />

          // count shows how many items match
          <FilterSelect
            label="Status"
            options={[
              { value: 'open', label: 'Open' },
              { value: 'review', status: 'in_review' },
            ]}
            defaultValue="open"
            count={3}
          />

          <FilterSelect label="Assignee" options={[]} placeholder="Anyone" disabled />

          // Fills its container, e.g. in a narrow side panel
          <FilterSelect fullwidth label="Sprint" options={sprints} defaultValue="sprint-24" />
        `,
      },
    },
  },
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
            { value: 'review', status: 'in_review' },
          ]}
          defaultValue="open"
          count={3}
        />
        <FilterSelect label="Assignee" options={[]} placeholder="Anyone" disabled />
      </div>
      <div className="w-80">
        <FilterSelect fullwidth label="Sprint" options={sprints} defaultValue="sprint-24" />
      </div>
    </div>
  ),
};
