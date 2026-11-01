import { useAppForm, useSelector } from '@sprintstack/forms';
import { SPRINT_LENGTH_MAX, SPRINT_LENGTH_MIN, sprintSettingsSchema } from '@sprintstack/shared';
import { Section, Text, useSidebar } from '@sprintstack/ui';
import { View } from 'react-native';
import {
  CURRENT_SPRINT,
  nextSprint,
  save,
  sprintsForm,
  useSaved,
  WEEKDAY_CHOICES,
  WEEKDAY_LABEL,
} from './data';

export const Sprints = () => {
  const saved = useSaved().sprints;
  const form = useAppForm({
    ...sprintsForm,
    defaultValues: saved,
    onSubmit: ({ value, formApi }) => {
      const settings = sprintSettingsSchema.parse(value);
      save({ sprints: settings });
      formApi.reset(settings);
    },
  });
  const values = useSelector(form.store, (state) => state.values);
  const next = nextSprint(values);
  const { drawer } = useSidebar();

  return (
    <>
      <Section
        title="Sprints"
        description={`Applies from the next sprint. Sprint ${CURRENT_SPRINT.number} keeps its current dates.`}
      >
        <form.AppField name="length">
          {(f) => (
            <f.NumberField
              label="Sprint length"
              description={`${SPRINT_LENGTH_MIN} to ${SPRINT_LENGTH_MAX} days. Two weeks suits most teams.`}
              min={SPRINT_LENGTH_MIN}
              max={SPRINT_LENGTH_MAX}
              unit="days"
            />
          )}
        </form.AppField>
        <form.AppField name="startDay">
          {(f) => (
            <f.SegmentedField
              label="Sprints start on"
              description={WEEKDAY_LABEL[values.startDay].name}
              choices={WEEKDAY_CHOICES}
            />
          )}
        </form.AppField>
        <View>
          <form.AppField name="autoStart">
            {(f) => (
              <f.ToggleRowField
                title="Start the next sprint automatically"
                description="At 09:00 on its start day."
              />
            )}
          </form.AppField>
          <form.AppField name="carryOver">
            {(f) => (
              <f.ToggleRowField
                title="Carry over unfinished work"
                description="Open items move to the next sprint, not the backlog."
              />
            )}
          </form.AppField>
        </View>
      </Section>
      <View
        accessibilityLiveRegion="polite"
        className={`gap-2 rounded-3xl bg-ink ${drawer ? 'p-6' : 'p-8'}`}
      >
        <Text className="text-sm font-bold uppercase text-on-ink">
          Next sprint with these settings
        </Text>
        <View>
          <Text className="text-4xl leading-12 font-extrabold uppercase text-on-ink">
            {next.name}
          </Text>
          <Text className="text-4xl leading-12 font-extrabold uppercase text-brand-on-ink">
            {next.dates}
          </Text>
        </View>
        <Text className="text-[1.0625rem] font-bold text-on-ink">
          {next.working} working {next.working === 1 ? 'day' : 'days'}
        </Text>
      </View>
      <View className={drawer ? '' : 'items-start'}>
        <form.AppForm>
          <form.SubmitButton size="lg" fullwidth={drawer}>
            Save changes
          </form.SubmitButton>
        </form.AppForm>
      </View>
    </>
  );
};
