import { Field, type FieldProps, Input, type InputProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'invalid';
export type TextFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<InputProps, Bound>;

export function TextField({ label, description, required, ...input }: TextFieldProps) {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <Input
        {...input}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
}
