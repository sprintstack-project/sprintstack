import {
  type DateRange,
  Field,
  type FieldProps,
  RangeCalendar,
  type RangeCalendarProps,
} from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'invalid';
export type RangeCalendarFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<RangeCalendarProps, Bound>;

/** A run of days picked on an inline calendar; the value is `{ start, end }` in ISO dates, or null. */
export const RangeCalendarField = ({
  label,
  description,
  required,
  ...calendar
}: RangeCalendarFieldProps) => {
  const field = useFieldContext<DateRange | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <RangeCalendar
        {...calendar}
        value={field.state.value ?? null}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
