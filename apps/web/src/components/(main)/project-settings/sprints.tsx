'use client';

import { useAppForm, useSelector } from '@sprintstack/forms';
import { SPRINT_LENGTH_MAX, SPRINT_LENGTH_MIN, sprintSettingsSchema } from '@sprintstack/shared';
import { Section } from '@ui/section';
import { CURRENT_SPRINT, nextSprint, save, sprintsForm, useSaved, WEEKDAY_CHOICES } from './data';

const Sprints = () => {
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

  return (
    <>
      <Section
        title="Sprints"
        description={`Applies from the next sprint. Sprint ${CURRENT_SPRINT.number} keeps its current dates.`}
      >
        <div className="max-w-sm">
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
        </div>
        <form.AppField name="startDay">
          {(f) => <f.SegmentedField label="Sprints start on" choices={WEEKDAY_CHOICES} />}
        </form.AppField>
        <div className="flex flex-col">
          <form.AppField name="autoStart">
            {(f) => (
              <f.ToggleRowField
                title="Start the next sprint automatically"
                description="When a sprint ends, the planned one starts at 09:00 on its start day."
              />
            )}
          </form.AppField>
          <form.AppField name="carryOver">
            {(f) => (
              <f.ToggleRowField
                title="Carry over unfinished work"
                description="Open items move to the next sprint instead of back to the backlog."
              />
            )}
          </form.AppField>
        </div>
      </Section>
      <section
        aria-live="polite"
        className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-ink p-6 text-on-ink md:px-10 md:py-8"
      >
        <div className="flex flex-col gap-2">
          <p className="eyebrow text-on-ink">Next sprint with these settings</p>
          <p className="headline text-[3rem] leading-none">
            {next.name} · <span className="text-brand-on-ink">{next.dates}</span>
          </p>
        </div>
        <p className="flex flex-col items-end font-stretch-semi-condensed">
          <span className="headline text-[3rem] leading-none">{next.working}</span>
          <span className="text-[1.0625rem] leading-6 font-bold">working days</span>
        </p>
      </section>
      <form.AppForm>
        <form.FormActions onDiscard={() => form.reset(saved)} />
      </form.AppForm>
    </>
  );
};

export default Sprints;
