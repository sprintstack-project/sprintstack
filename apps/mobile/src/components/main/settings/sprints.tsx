import { touchSlop } from '@lib/scale';
import { useAppForm, useSelector } from '@sprintstack/forms';
import {
  SPRINT_LENGTH_MAX,
  SPRINT_LENGTH_MIN,
  sprintSettingsSchema,
  WEEKDAYS,
} from '@sprintstack/shared';
import { Text, useSidebar } from '@sprintstack/ui';
import { Pressable, View } from 'react-native';
import { CURRENT_SPRINT, nextSprint, save, sprintsForm, useSaved, WEEKDAY_LABEL } from './data';
import { Label, Panel, ToggleRow } from './parts';

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
      <Panel
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
            <View className="gap-3">
              <Label>Sprints start on</Label>
              <View
                accessibilityRole="radiogroup"
                accessibilityLabel="Sprints start on"
                className="flex-row rounded-full bg-surface-muted p-1"
              >
                {WEEKDAYS.map((day) => {
                  const selected = f.state.value === day;
                  return (
                    <Pressable
                      key={day}
                      accessibilityRole="radio"
                      accessibilityLabel={WEEKDAY_LABEL[day].name}
                      accessibilityState={{ checked: selected }}
                      hitSlop={touchSlop(44)}
                      onPress={() => f.handleChange(day)}
                      className={`h-11 flex-1 items-center justify-center rounded-full ${selected ? 'bg-ink' : 'active:bg-surface-pressed'}`}
                    >
                      <Text
                        className={`text-[1.0625rem] font-extrabold ${selected ? 'text-on-ink' : 'text-ink'}`}
                      >
                        {WEEKDAY_LABEL[day].letter}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text className="text-meta text-ink-muted">{WEEKDAY_LABEL[f.state.value].name}</Text>
            </View>
          )}
        </form.AppField>
        <View>
          <form.AppField name="autoStart">
            {(f) => (
              <ToggleRow
                title="Start the next sprint automatically"
                description="At 09:00 on its start day."
                checked={f.state.value}
                onCheckedChange={f.handleChange}
              />
            )}
          </form.AppField>
          <form.AppField name="carryOver">
            {(f) => (
              <ToggleRow
                title="Carry over unfinished work"
                description="Open items move to the next sprint, not the backlog."
                checked={f.state.value}
                onCheckedChange={f.handleChange}
              />
            )}
          </form.AppField>
        </View>
      </Panel>
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
          <form.SubmitButton size="lg" block={drawer}>
            Save changes
          </form.SubmitButton>
        </form.AppForm>
      </View>
    </>
  );
};
