import { useAppForm } from '@sprintstack/forms';
import { type IssueInput, issueSchema } from '@sprintstack/shared';
import { Card, EMPTY_DOC } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BookOpen, Bug, CheckSquare } from 'lucide-react';
import { useEffect } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { sampleDoc } from '../ui/RichTextEditor.stories';

const empty: IssueInput = {
  summary: '',
  type: null,
  priority: null,
  description: EMPTY_DOC,
  points: null,
  labels: [],
  dueDate: null,
};

const saved: IssueInput = {
  summary: 'Checkout fails on saved cards',
  type: 'bug',
  priority: 'highest',
  description: sampleDoc,
  points: 3,
  labels: ['payments', 'ios'],
  dueDate: '2026-10-30',
};

const typeOptions = [
  { value: 'bug', label: 'Bug', icon: Bug },
  { value: 'story', label: 'Story', icon: BookOpen },
  { value: 'task', label: 'Task', icon: CheckSquare },
];
const priorityOptions = ['highest', 'high', 'medium', 'low', 'lowest'].map((value) => ({
  value,
  label: value[0].toUpperCase() + value.slice(1),
}));
const labelOptions = ['payments', 'ios', 'web', 'tech-debt', 'flaky'].map((value) => ({
  value,
  label: value,
}));

interface IssueFormProps {
  onSubmit: (issue: ReturnType<typeof issueSchema.parse>) => void;
  /** Simulates editing: the saved issue arrives after the first render. */
  load?: () => Promise<IssueInput>;
}

const IssueForm = ({ onSubmit, load }: IssueFormProps) => {
  const form = useAppForm({
    defaultValues: empty,
    // Validate on every change; fields show errors once left or after a submit attempt.
    validators: { onChange: issueSchema },
    onSubmit: ({ value }) => onSubmit(issueSchema.parse(value)),
  });

  useEffect(() => {
    // Data that arrives late goes in through reset; the editor follows without a remount.
    load?.().then((issue) => form.reset(issue));
  }, [form, load]);

  return (
    <Card title={load ? 'Edit issue' : 'Create issue'}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <form.AppField name="summary">
            {(f) => (
              <f.TextField
                label="Summary"
                required
                placeholder="E.g. checkout fails on saved cards"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="type">
          {(f) => (
            <f.SelectField label="Type" required placeholder="E.g. Bug" options={typeOptions} />
          )}
        </form.AppField>
        <form.AppField name="priority">
          {(f) => (
            <f.SelectField
              label="Priority"
              required
              placeholder="E.g. High"
              options={priorityOptions}
            />
          )}
        </form.AppField>
        <div className="md:col-span-2">
          <form.AppField name="description">
            {(f) => (
              <f.RichTextField
                label="Description"
                required
                placeholder="Steps to reproduce, expected and actual result"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="points">
          {(f) => <f.NumberField label="Story points" min={0} max={21} />}
        </form.AppField>
        <form.AppField name="dueDate">{(f) => <f.DateField label="Due date" />}</form.AppField>
        <div className="md:col-span-2">
          <form.AppField name="labels">
            {(f) => (
              <f.MultiSelectField
                label="Labels"
                placeholder="Add labels"
                options={labelOptions}
                creatable
              />
            )}
          </form.AppField>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <form.AppForm>
          <form.SubmitButton>{load ? 'Save changes' : 'Create issue'}</form.SubmitButton>
        </form.AppForm>
      </div>
    </Card>
  );
};

const meta = {
  title: 'Forms/IssueForm',
  component: IssueForm,
  parameters: {
    docs: {
      description: {
        component: `Forms use \`@sprintstack/forms\` (TanStack Form) with a schema from \`@sprintstack/shared\` (Zod), shared with the API. Fields show errors after you leave them or press submit, and clear as soon as they're fixed.

\`\`\`tsx
import { useAppForm } from '@sprintstack/forms';
import { issueSchema } from '@sprintstack/shared';

const form = useAppForm({
  defaultValues,
  validators: { onChange: issueSchema },
  onSubmit: ({ value }) => api.createIssue(issueSchema.parse(value)),
});

<form.AppField name="summary">{(f) => <f.TextField label="Summary" required />}</form.AppField>
<form.AppField name="description">{(f) => <f.RichTextField label="Description" required />}</form.AppField>
<form.AppForm><form.SubmitButton>Create issue</form.SubmitButton></form.AppForm>
\`\`\`

Editing: load the record, then \`form.reset(record)\`; every field, including the rich text, fills in.`,
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<typeof IssueForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const summary = canvas.getByRole('textbox', { name: 'Summary' });

    // Errors wait until the field is left...
    await userEvent.click(summary);
    await expect(canvas.queryByText('Enter a summary')).toBeNull();
    await userEvent.tab();
    await expect(await canvas.findByText('Enter a summary')).toBeInTheDocument();
    await expect(summary).toHaveAccessibleDescription('Enter a summary');

    // ...and clear as soon as they're fixed.
    await userEvent.type(summary, 'Checkout fails on saved cards');
    await waitFor(() => expect(canvas.queryByText('Enter a summary')).toBeNull());

    // Submitting shows every remaining error and doesn't call onSubmit.
    await userEvent.click(canvas.getByRole('button', { name: 'Create issue' }));
    await expect(await canvas.findByText('Choose an issue type')).toBeInTheDocument();
    await expect(canvas.getByText('Choose a priority')).toBeInTheDocument();
    await expect(canvas.getByText('Describe the issue')).toBeInTheDocument();
    await expect(args.onSubmit).not.toHaveBeenCalled();

    // Fill the rest and submit.
    await userEvent.click(canvas.getByRole('combobox', { name: 'Type' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Bug' }));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Priority' }));
    await userEvent.click(await screen.findByRole('option', { name: 'High' }));
    await userEvent.click(canvas.getByRole('textbox', { name: 'Description' }));
    await userEvent.keyboard('Steps to reproduce');
    await waitFor(() => expect(canvas.queryByText('Describe the issue')).toBeNull());

    await userEvent.click(canvas.getByRole('button', { name: 'Create issue' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce());
    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        summary: 'Checkout fails on saved cards',
        type: 'bug',
        priority: 'high',
      }),
    );
  },
};

const loadSaved = () => new Promise<IssueInput>((resolve) => setTimeout(() => resolve(saved), 300));

/** The issue loads after the first render: every field, including the rich text, fills in. */
export const Edit: Story = {
  parameters: { singleTheme: true },
  args: { load: loadSaved },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByRole('textbox', { name: 'Summary' })).toHaveValue(
        'Checkout fails on saved cards',
      ),
    );
    const description = canvas.getByRole('textbox', { name: 'Description' });
    await waitFor(() =>
      expect(description).toHaveTextContent('Saved cards fail at checkout on iOS 18.'),
    );
    await expect(canvas.getByRole('combobox', { name: 'Type' })).toHaveTextContent('Bug');
    await expect(canvas.getByRole('button', { name: 'Remove payments' })).toBeInTheDocument();

    // Edit the loaded description and save.
    await userEvent.click(description);
    await userEvent.keyboard(' Updated.');
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalledOnce());
  },
};
