import { Field, type FieldProps, NumberInput, type NumberInputProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type NumberFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<NumberInputProps, Bound>;

export const NumberField = ({ label, description, required, ...number }: NumberFieldProps) => {
  const field = useFieldContext<number | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <NumberInput
        {...number}
        value={field.state.value ?? null}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
