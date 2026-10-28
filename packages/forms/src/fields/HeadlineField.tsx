import { HeadlineInput, type HeadlineInputProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error';
export type HeadlineFieldProps = Omit<HeadlineInputProps, Bound>;

/** A title set as the headline. It carries its own error, so it isn't wrapped in `Field`. */
export const HeadlineField = (props: HeadlineFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <HeadlineInput
      {...props}
      value={field.state.value ?? ''}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      error={error}
    />
  );
};
