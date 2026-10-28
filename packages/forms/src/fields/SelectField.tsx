import { Field, type FieldProps, Select, type SelectProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type SelectFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<SelectProps<string>, Bound> & {
    /**
     * The value of an option that stands for "none", e.g. `{ value: 'none', label: 'Unassigned' }`.
     * Picking it stores null, and a null value shows it.
     */
    nullValue?: string;
  };

export const SelectField = ({
  label,
  description,
  required,
  nullValue,
  ...select
}: SelectFieldProps) => {
  const field = useFieldContext<string | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <Select
        {...select}
        value={field.state.value ?? nullValue ?? null}
        onValueChange={(next) => field.handleChange(next === nullValue ? null : next)}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
