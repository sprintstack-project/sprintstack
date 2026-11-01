'use client';

import { useAppForm } from '@sprintstack/forms';
import { notificationSettingsSchema } from '@sprintstack/shared';
import { Eyebrow } from '@ui/eyebrow';
import { Section } from '@ui/section';
import { Segmented } from '@ui/segmented';
import { CHANNEL_CHOICES, EVENTS, notificationsForm, ROLE_OPTIONS, save, useSaved } from './data';

const Notifications = () => {
  const saved = useSaved().notifications;
  const form = useAppForm({
    ...notificationsForm,
    defaultValues: saved,
    onSubmit: ({ value, formApi }) => {
      const settings = notificationSettingsSchema.parse(value);
      save({ notifications: settings });
      formApi.reset(settings);
    },
  });

  return (
    <>
      <Section
        title="Notifications"
        description="Project-wide rules. Each person can still mute these in their own account settings."
      >
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <Eyebrow>Event</Eyebrow>
            <form.AppField name="channel">
              {(f) => (
                <Segmented
                  label="Send as"
                  choices={CHANNEL_CHOICES}
                  value={f.state.value}
                  onValueChange={f.handleChange}
                  onBlur={f.handleBlur}
                />
              )}
            </form.AppField>
          </div>
          {EVENTS.map((event) => (
            <div
              key={event.key}
              className="grid items-center gap-x-8 gap-y-4 border-t border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(14rem,1.2fr)_auto] last:pb-0"
            >
              <div className="flex flex-col gap-1 font-stretch-semi-condensed">
                <p className="text-[1.0625rem] leading-6 font-bold text-ink">{event.title}</p>
                <p className="text-[1.0625rem] leading-6 text-ink-muted">{event.description}</p>
              </div>
              <form.AppField name={`rules.${event.key}.roles`}>
                {(f) => (
                  <f.MultiSelectField
                    label="Notify roles"
                    options={ROLE_OPTIONS}
                    chipTone="neutral"
                    placeholder="Choose roles"
                  />
                )}
              </form.AppField>
              <form.AppField name={`rules.${event.key}.enabled`}>
                {(f) => (
                  <div className="md:pt-7">
                    <f.SwitchField label={event.title} />
                  </div>
                )}
              </form.AppField>
            </div>
          ))}
        </div>
      </Section>
      <form.AppForm>
        <form.FormActions onDiscard={() => form.reset(saved)} />
      </form.AppForm>
    </>
  );
};

export default Notifications;
