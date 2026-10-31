'use client';

import { useAppForm, useSelector } from '@sprintstack/forms';
import { SPRINT_LENGTH_MAX, SPRINT_LENGTH_MIN, sprintSettingsSchema } from '@sprintstack/shared';
import { Segmented } from '../timeline/toolbar';
import { CURRENT_SPRINT, nextSprint, save, sprintsForm, useSaved, WEEKDAY_CHOICES } from './data';
import { Actions, Panel, ToggleRow } from './parts';

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
      <Panel
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
          {(f) => (
            <div className="flex flex-col gap-3">
              <p className="text-[1.0625rem] leading-5.5 font-bold text-ink font-stretch-semi-condensed">
                Sprints start on
              </p>
              <div className="self-start overflow-x-auto">
                <Segmented
                  label="Sprints start on"
                  choices={WEEKDAY_CHOICES}
                  value={f.state.value}
                  onChange={f.handleChange}
                />
              </div>
            </div>
          )}
        </form.AppField>
        <div className="flex flex-col">
          <form.AppField name="autoStart">
            {(f) => (
              <ToggleRow
                title="Start the next sprint automatically"
                description="When a sprint ends, the planned one starts at 09:00 on its start day."
                checked={f.state.value}
                onCheckedChange={f.handleChange}
                className="border-t border-line py-6"
              />
            )}
          </form.AppField>
          <form.AppField name="carryOver">
            {(f) => (
              <ToggleRow
                title="Carry over unfinished work"
                description="Open items move to the next sprint instead of back to the backlog."
                checked={f.state.value}
                onCheckedChange={f.handleChange}
                className="border-t border-line pt-6"
              />
            )}
          </form.AppField>
        </div>
      </Panel>
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
      <Actions
        save={
          <form.AppForm>
            <form.SubmitButton size="lg">Save changes</form.SubmitButton>
          </form.AppForm>
        }
        onDiscard={() => form.reset(saved)}
      />
    </>
  );
};

export default Sprints;
