import { useAppForm } from '@sprintstack/forms';
import { type IssueInput, issueSchema } from '@sprintstack/shared';
import { EMPTY_DOC } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { BookOpen, Bug, CheckSquare } from 'lucide-react-native';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const empty: IssueInput = {
  summary: '',
  type: null,
  priority: null,
  description: EMPTY_DOC,
  points: null,
  labels: [],
  dueDate: null,
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

/** Same fields and schema as the web Forms/IssueForm story, on native components. */
const IssueForm = ({ onSubmit }: { onSubmit: (summary: string) => void }) => {
  const form = useAppForm({
    defaultValues: empty,
    validators: { onChange: issueSchema },
    onSubmit: ({ value }) => onSubmit(issueSchema.parse(value).summary),
  });
  return (
    <View className="gap-5">
      <form.AppField name="summary">
        {(f) => (
          <f.TextField label="Summary" required placeholder="E.g. checkout fails on saved cards" />
        )}
      </form.AppField>
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
      <form.AppField name="description">
        {(f) => (
          <f.RichTextField
            label="Description"
            required
            placeholder="Steps to reproduce, expected and actual result"
          />
        )}
      </form.AppField>
      <form.AppField name="points">
        {(f) => <f.NumberField label="Story points" min={0} max={21} />}
      </form.AppField>
      <form.AppField name="dueDate">{(f) => <f.DateField label="Due date" />}</form.AppField>
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
      <View className="items-end">
        <form.AppForm>
          <form.SubmitButton>Create issue</form.SubmitButton>
        </form.AppForm>
      </View>
    </View>
  );
};

const meta = {
  title: 'Forms/IssueForm',
  component: IssueForm,
  args: { onSubmit: fn() },
} satisfies Meta<typeof IssueForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};
