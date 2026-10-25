import { Field, type FieldProps, Select, type SelectProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type SelectFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<SelectProps<string>, Bound>;

export const SelectField = ({ label, description, required, ...select }: SelectFieldProps) => {
  const field = useFieldContext<string | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <Select
        {...select}
        value={field.state.value ?? null}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
