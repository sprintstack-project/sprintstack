import { withForm } from '@sprintstack/forms';
import { MORE_STORY_POINTS, STORY_POINTS } from '@sprintstack/shared';
import { View } from 'react-native';
import {
  ASSIGNEE_OPTIONS,
  NONE,
  PRIORITY_OPTIONS,
  SPRINT_OPTIONS,
  STATUS_OPTIONS,
  TAG_OPTIONS,
  TYPE_OPTIONS,
  workItemForm,
} from './data';

/** The item's details under the title: what it is, who has it, when and how big. */
export const Properties = withForm({
  ...workItemForm,
  render: ({ form }) => (
    <View className="gap-6">
      <form.AppField name="type">
        {(f) => <f.SelectField label="Type" placeholder="Choose a type" options={TYPE_OPTIONS} />}
      </form.AppField>
      <form.AppField name="status">
        {(f) => <f.SelectField label="Status" options={STATUS_OPTIONS} />}
      </form.AppField>
      <View className="flex-row gap-4">
        <View className="flex-1">
          <form.AppField name="sprint">
            {(f) => <f.SelectField label="Sprint" options={SPRINT_OPTIONS} nullValue={NONE} />}
          </form.AppField>
        </View>
        <View className="flex-1">
          <form.AppField name="priority">
            {(f) => <f.SelectField label="Priority" options={PRIORITY_OPTIONS} />}
          </form.AppField>
        </View>
      </View>
      <form.AppField name="assignee">
        {(f) => (
          <f.SelectField label="Assignee" options={ASSIGNEE_OPTIONS} nullValue={NONE} searchable />
        )}
      </form.AppField>
      <View className="flex-row gap-4">
        <View className="flex-1">
          <form.AppField name="start">
            {(f) => <f.DateField label="Start" placeholder="Not set" />}
          </form.AppField>
        </View>
        <View className="flex-1">
          {/* Re-checked when the start moves, so "target before start" shows either way round. */}
          <form.AppField name="target" validators={{ onChangeListenTo: ['start'] }}>
            {(f) => <f.DateField label="Target" placeholder="Not set" />}
          </form.AppField>
        </View>
      </View>
      <form.AppField name="points">
        {(f) => <f.StoryPointsField scale={STORY_POINTS} more={MORE_STORY_POINTS} />}
      </form.AppField>
      <form.AppField name="tags">
        {(f) => (
          <f.MultiSelectField
            label="Tags"
            placeholder="Add tag…"
            options={TAG_OPTIONS}
            chipTone="neutral"
            creatable
            max={10}
          />
        )}
      </form.AppField>
    </View>
  ),
});
