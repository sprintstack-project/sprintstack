'use client';

import { useAppForm } from '@sprintstack/forms';
import { notificationSettingsSchema } from '@sprintstack/shared';
import { Switch } from '@ui/switch';
import { Segmented } from '../timeline/toolbar';
import { CHANNEL_CHOICES, EVENTS, notificationsForm, ROLE_OPTIONS, save, useSaved } from './data';
import { Actions, Panel } from './parts';

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
      <Panel
        title="Notifications"
        description="Project-wide rules. Each person can still mute these in their own account settings."
      >
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
            <p className="eyebrow">Event</p>
            <form.AppField name="channel">
              {(f) => (
                <Segmented
                  label="Send as"
                  choices={CHANNEL_CHOICES}
                  value={f.state.value}
                  onChange={f.handleChange}
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
                    <Switch
                      label={event.title}
                      checked={f.state.value}
                      onCheckedChange={f.handleChange}
                    />
                  </div>
                )}
              </form.AppField>
            </div>
          ))}
        </div>
      </Panel>
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

export default Notifications;
