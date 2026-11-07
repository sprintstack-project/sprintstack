import Field from '@ui/field';
import MultiSelect from '@ui/multi-select';
import type { FieldProps, MultiSelectProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type MultiSelectFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<MultiSelectProps<string>, Bound>;

export const MultiSelectField = ({
  label,
  description,
  required,
  ...multi
}: MultiSelectFieldProps) => {
  const field = useFieldContext<string[]>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <MultiSelect
        {...multi}
        value={field.state.value ?? []}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
