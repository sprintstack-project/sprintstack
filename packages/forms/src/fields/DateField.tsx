import DatePicker from '@ui/date-picker';
import Field from '@ui/field';
import type { DatePickerProps, FieldProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type DateFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<DatePickerProps, Bound>;

export const DateField = ({ label, description, required, ...picker }: DateFieldProps) => {
  const field = useFieldContext<string | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <DatePicker
        {...picker}
        value={field.state.value ?? null}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
