import { StoryPoints, type StoryPointsProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onValueChange' | 'onBlur' | 'error';
export type StoryPointsFieldProps = Omit<StoryPointsProps, Bound>;

/** Story points. A group with its own legend and error, so it isn't wrapped in `Field`. */
export const StoryPointsField = (props: StoryPointsFieldProps) => {
  const field = useFieldContext<number | null>();
  const error = useFieldError();
  return (
    <StoryPoints
      {...props}
      value={field.state.value ?? null}
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      error={error}
    />
  );
};
