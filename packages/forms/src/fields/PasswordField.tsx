import Field from '@ui/field';
import InputPassword from '@ui/input-password';
import type { FieldProps, InputProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'invalid' | 'type' | 'slots';
export type PasswordFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<InputProps, Bound>;

export const PasswordField = ({ label, description, required, ...input }: PasswordFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <InputPassword
        {...input}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
};
