import { ToggleRow, type ToggleRowProps } from '@sprintstack/ui';
import { useFieldContext } from '../context';

type Bound = 'checked' | 'onCheckedChange';
export type ToggleRowFieldProps = Omit<ToggleRowProps, Bound>;

export const ToggleRowField = (props: ToggleRowFieldProps) => {
  const field = useFieldContext<boolean>();
  return (
    <ToggleRow
      {...props}
      checked={Boolean(field.state.value)}
      onCheckedChange={(checked) => {
        field.handleChange(checked);
        // A switch has no "leaving" moment, so each change counts as touched.
        field.handleBlur();
      }}
    />
  );
};
