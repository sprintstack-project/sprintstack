import { Switch, type SwitchProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';

type Bound = 'checked' | 'defaultChecked' | 'onCheckedChange';
export type SwitchFieldProps = Omit<SwitchProps, Bound>;

export const SwitchField = (props: SwitchFieldProps) => {
  const field = useFieldContext<boolean>();
  return (
    <Switch
      {...props}
      checked={Boolean(field.state.value)}
      onCheckedChange={(checked) => {
        field.handleChange(checked);
        // A switch has no "leaving" moment, so each change counts as touched.
        field.handleBlur();
      }}
    />
  );
};
