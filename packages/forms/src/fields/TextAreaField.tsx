import { Field, type FieldProps, TextArea, type TextAreaProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'invalid';
export type TextAreaFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<TextAreaProps, Bound>;

export const TextAreaField = ({
  label,
  description,
  required,
  ...textarea
}: TextAreaFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <TextArea
        {...textarea}
        value={field.state.value ?? ''}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
};
