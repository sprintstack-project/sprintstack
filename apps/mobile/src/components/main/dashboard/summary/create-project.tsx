import { useCreateProject } from '@sprintstack/api-client/projects';
import { useAppForm } from '@sprintstack/forms/form';
import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  type ProjectDetailsInput,
  projectDetailsSchema,
} from '@sprintstack/shared/schemas/project';
import Button from '@ui/button';
import Dialog from '@ui/dialog';
import Text from '@ui/text';
import { useState } from 'react';
import { View } from 'react-native';
import { useProjectContext } from '@/providers/main/project';

const defaultValues: ProjectDetailsInput = { name: '', key: '', description: '' };

interface BodyProps {
  onClose: () => void;
  onCreated: (id: string) => void;
}

/** Mounted while open, so each opening starts with an empty form. */
const Body = ({ onClose, onCreated }: BodyProps) => {
  const [, createProject] = useCreateProject();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: projectDetailsSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const { data, error } = await createProject({ input: projectDetailsSchema.parse(value) });
      if (!data?.createProject) {
        const conflict = error?.graphQLErrors.find((e) => e.extensions?.code === 'CONFLICT');
        setError(conflict?.message ?? 'Couldn’t create the project. Try again.');
        return;
      }
      onClose();
      onCreated(data.createProject.id);
    },
  });

  return (
    <View className="gap-5 pt-1">
      <Text className="text-[1rem] leading-6 text-ink-muted">
        You can change these details later in project settings.
      </Text>
      {error && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-[1rem] leading-6 font-bold text-danger"
        >
          {error}
        </Text>
      )}
      <form.AppField name="name">
        {(f) => <f.TextField label="Project name" required autoComplete="off" />}
      </form.AppField>
      <form.AppField
        name="key"
        listeners={{
          // Keys are capitals, whatever was typed.
          onChange: ({ value }) => {
            const upper = value.toUpperCase();
            if (upper !== value) form.setFieldValue('key', upper);
          },
        }}
      >
        {(f) => (
          <f.TextField
            label="Key"
            required
            description="Prefix for work item IDs, e.g. PAY-1482"
            autoComplete="off"
          />
        )}
      </form.AppField>
      <form.AppField name="description">
        {(f) => (
          <f.TextAreaField
            label="Description"
            rows={3}
            maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
          />
        )}
      </form.AppField>
      <View className="flex-row gap-3">
        <Button variant="ghost" size="lg" onClick={onClose}>
          Cancel
        </Button>
        <View className="flex-1">
          <form.AppForm>
            <form.SubmitButton size="lg" fullwidth>
              Create project
            </form.SubmitButton>
          </form.AppForm>
        </View>
      </View>
    </View>
  );
};

interface CreateProjectProps {
  open: boolean;
  onClose: () => void;
}

/** A dialog for creating a project, which then becomes the selected one. */
const CreateProject = ({ open, onClose }: CreateProjectProps) => {
  // Read here: the dialog renders in the root portal, outside ProjectProvider.
  const { setProjectId } = useProjectContext();
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title="Create your first project"
    >
      <Body onClose={onClose} onCreated={setProjectId} />
    </Dialog>
  );
};

export default CreateProject;
