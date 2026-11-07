import CodeInput from '@ui/code-input';
import Field from '@ui/field';
import type { CodeInputProps, FieldProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'invalid';
export type CodeFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<CodeInputProps, Bound>;

export const CodeField = ({ label, description, required, ...input }: CodeFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <CodeInput
        {...input}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
};
