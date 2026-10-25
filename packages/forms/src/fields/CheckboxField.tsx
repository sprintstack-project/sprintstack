import { Checkbox, type CheckboxProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'checked' | 'defaultChecked' | 'onCheckedChange' | 'error';
export type CheckboxFieldProps = Omit<CheckboxProps, Bound>;

export const CheckboxField = (props: CheckboxFieldProps) => {
  const field = useFieldContext<boolean>();
  const error = useFieldError();
  return (
    <Checkbox
      {...props}
      checked={Boolean(field.state.value)}
      onCheckedChange={(checked) => {
        field.handleChange(checked);
        // A checkbox has no "leaving" moment, so each change counts as touched.
        field.handleBlur();
      }}
      error={error}
    />
  );
};
