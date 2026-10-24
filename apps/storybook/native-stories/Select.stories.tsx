import { Field, MultiSelect, Select } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { Calendar, Clock, Equal, Flag, Trash2 } from 'lucide-react-native';
import { fn } from 'storybook/test';

const sortOptions = [
  { value: 'recent', label: 'Most recent', icon: Clock },
  { value: 'rel', label: 'Relevance', icon: Equal },
  { value: 'prio', label: 'Highest priority', icon: Flag },
  { value: 'due', label: 'Due date', icon: Calendar, disabled: true },
  { value: 'clear', label: 'Clear this view', icon: Trash2, danger: true, action: () => {} },
];
const statusOptions = [
  { value: 'todo', status: 'neutral' as const },
  { value: 'progress', status: 'info' as const },
  { value: 'review', status: 'review' as const },
  { value: 'done', status: 'success' as const },
  { value: 'blocked', status: 'danger' as const },
];
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

const meta = {
  title: 'UI/Select',
  component: Select,
  args: {
    options: sortOptions,
    defaultValue: 'recent',
    placeholder: 'Choose an order',
    onValueChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Sort by">
        <Select defaultValue="recent" options={sortOptions} />
      </Field>
      <Field label="Status">
        <Select defaultValue="review" options={statusOptions} />
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
    </>
  ),
};

export const Multi: Story = {
  name: 'MultiSelect',
  render: () => (
    <>
      <Field label="Labels" description="Type in the sheet to create a label">
        <MultiSelect defaultValue={['payments']} options={labels} creatable />
      </Field>
      <Field label="Assignees">
        <MultiSelect defaultValue={['mo', 'jl']} placeholder="Add people" options={people} />
      </Field>
      <Field label="Reviewers" error="Pick at most 2 reviewers">
        <MultiSelect max={2} defaultValue={['mo', 'jl']} options={people} invalid />
      </Field>
      <Field label="Labels" description="Locked while the sprint runs">
        <MultiSelect chipTone="outline" defaultValue={['web']} options={labels} disabled />
      </Field>
    </>
  ),
};
