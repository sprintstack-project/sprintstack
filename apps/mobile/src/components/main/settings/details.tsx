import { scaled } from '@lib/scale';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { PROJECT_DESCRIPTION_MAX_LENGTH, projectDetailsSchema } from '@sprintstack/shared';
import { Button, Text, useSidebar } from '@sprintstack/ui';
import { Archive, ImageIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { detailsForm, save, useSaved } from './data';
import { Label, Panel } from './parts';

export const Details = () => {
  const saved = useSaved().details;
  const danger = useTokenColor('danger');
  const { drawer } = useSidebar();
  const form = useAppForm({
    ...detailsForm,
    defaultValues: saved,
    onSubmit: ({ value, formApi }) => {
      const details = projectDetailsSchema.parse(value);
      save({ details });
      formApi.reset(details);
    },
  });
  const key = useSelector(form.store, (state) => state.values.key);

  return (
    <>
      <Panel
        title="Details"
        description="Shown across the app, in links and in notification emails."
      >
        <View className="flex-row items-center gap-5">
          <View
            aria-hidden
            className="size-28 items-center justify-center rounded-3xl bg-brand px-2"
          >
            <Text className="text-[2.5rem] leading-12 font-extrabold uppercase text-on-brand">
              {key.slice(0, 3) || '?'}
            </Text>
          </View>
          <View className="items-start gap-3">
            <Label>Project icon</Label>
            {/* Picking an image needs expo-image-picker (a native rebuild); the key shows until then. */}
            <Button variant="secondary" size="sm" icon={ImageIcon}>
              Change
            </Button>
          </View>
        </View>
        <form.AppField name="name">
          {(f) => <f.TextField label="Project name" required />}
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
              description={`Prefix for IDs, e.g. ${key || 'PAY'}-1482`}
              autoComplete="off"
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(f) => (
            <f.TextAreaField
              label="Description"
              rows={4}
              maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
            />
          )}
        </form.AppField>
        <View className={drawer ? '' : 'items-start border-t border-line pt-6'}>
          <form.AppForm>
            <form.SubmitButton size="lg" block={drawer}>
              Save changes
            </form.SubmitButton>
          </form.AppForm>
        </View>
      </Panel>
      <View className={`gap-3 rounded-3xl border border-danger ${drawer ? 'p-6' : 'p-8'}`}>
        <Text accessibilityRole="header" className="text-title uppercase text-ink">
          Archive project
        </Text>
        <Text className="text-[0.9375rem] leading-6 text-ink-muted">
          {drawer
            ? `Hides ${saved.name} and stops notifications. Restore within 30 days.`
            : `Hides ${saved.name} from everyone and stops notifications. Work items stay searchable and you can restore it within 30 days.`}
        </Text>
        {/* Archiving needs the API; the button is here so the layout is final. */}
        <Pressable
          accessibilityRole="button"
          className={`mt-2 h-14 flex-row items-center justify-center gap-2 rounded-full border-2 border-danger active:bg-surface-pressed ${drawer ? '' : 'self-start px-8'}`}
        >
          <Archive aria-hidden size={scaled(22)} strokeWidth={2} color={danger} />
          <Text className="text-[1.1875rem] leading-5 font-extrabold text-danger">Archive</Text>
        </Pressable>
      </View>
    </>
  );
};
