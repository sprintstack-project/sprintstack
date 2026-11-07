import Segmented from '@ui/segmented';
import type { SegmentedProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'error';
export type SegmentedFieldProps = Omit<SegmentedProps, Bound>;

/** Story points. A group with its own legend and error, so it isn't wrapped in `Field`. */
export const SegmentedField = (props: SegmentedFieldProps) => {
  const field = useFieldContext<number | null>();
  const error = useFieldError();
  return (
    <Segmented
      {...props}
      value={field.state.value ?? null}
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      error={error}
    />
  );
};
