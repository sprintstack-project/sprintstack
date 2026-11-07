import Field from '@ui/field';
import Tabs from '@ui/tabs';
import type { FieldProps, TabsProps } from '@ui/types';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'label' | 'value' | 'onValueChange' | 'onBlur';
export type TabsFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<TabsProps<string>, Bound>;

export const TabsField = ({ label, description, required, choices }: TabsFieldProps) => {
  const field = useFieldContext<string>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <Tabs
        label={label}
        choices={choices}
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
      />
    </Field>
  );
};
