import Field from '@ui/field';
import Segmented from '@ui/segmented';
import type { FieldProps, SegmentedProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'label' | 'value' | 'onValueChange' | 'onBlur';
export type SegmentedFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<SegmentedProps<string>, Bound>;

export const SegmentedField = ({ label, description, required, choices }: SegmentedFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <Segmented
        label={label}
        choices={choices}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
};
