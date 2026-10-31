import { scaled, touchSlop } from '@lib/scale';
import { useAppForm } from '@sprintstack/forms';
import {
  notificationSettingsSchema,
  PROJECT_ROLE_LABEL,
  type ProjectRole,
} from '@sprintstack/shared';
import { Chip, Text, useSidebar } from '@sprintstack/ui';
import Select from '@ui/select/select';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { CHANNEL_CHOICES, EVENTS, notificationsForm, ROLE_OPTIONS, save, useSaved } from './data';
import { Panel, Segmented, ToggleRow } from './parts';

/** The roles a rule notifies, as removable chips, and a button that adds one from a sheet. */
const RoleChips = ({
  value,
  onChange,
}: {
  value: ProjectRole[];
  onChange: (roles: ProjectRole[]) => void;
}) => {
  const ink = useTokenColor('ink');
  const remaining = ROLE_OPTIONS.filter((option) => !value.includes(option.value as ProjectRole));
  return (
    <View className="flex-row flex-wrap gap-2">
      {value.map((role) => (
        <Chip key={role} size="sm" onRemove={() => onChange(value.filter((r) => r !== role))}>
          {PROJECT_ROLE_LABEL[role]}
        </Chip>
      ))}
      {remaining.length > 0 && (
        <Select
          options={remaining}
          value={null}
          onValueChange={(next) => next && onChange([...value, next as ProjectRole])}
          trigger={{
            label: value.length ? 'Add role' : 'Notify roles',
            hitSlop: touchSlop(34),
            className:
              'h-[2.125rem] flex-row items-center gap-1.5 rounded-full border-[1.5px] border-line-strong pr-3.5 pl-3 active:bg-surface-pressed',
            children: (
              <>
                <Plus aria-hidden size={scaled(18)} strokeWidth={2} color={ink} />
                <Text className="text-[0.9375rem] font-semibold text-ink">
                  {value.length ? 'Add role' : 'Notify roles'}
                </Text>
              </>
            ),
          }}
        />
      )}
    </View>
  );
};

export const Notifications = () => {
  const saved = useSaved().notifications;
  const { drawer } = useSidebar();
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
        description="Project-wide rules. Each person can still mute these in their own account."
        phoneDescription
      >
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
        <View>
          {EVENTS.map((event) => (
            <form.AppField key={event.key} name={`rules.${event.key}`}>
              {(f) => (
                <ToggleRow
                  title={event.title}
                  description={event.description}
                  checked={f.state.value.enabled}
                  onCheckedChange={(enabled) => f.handleChange({ ...f.state.value, enabled })}
                >
                  <RoleChips
                    value={f.state.value.roles}
                    onChange={(roles) => f.handleChange({ ...f.state.value, roles })}
                  />
                </ToggleRow>
              )}
            </form.AppField>
          ))}
        </View>
      </Panel>
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
