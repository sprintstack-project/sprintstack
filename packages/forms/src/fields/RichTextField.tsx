import {
  Field,
  type FieldProps,
  type RichTextDoc,
  RichTextEditor,
  type RichTextEditorProps,
} from '@sprintstack/ui';
import { useFieldContext } from '../context';
import { useFieldError } from '../use-field-error';

type Bound = 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'invalid';
export type RichTextFieldProps = Omit<FieldProps, 'children' | 'error' | 'htmlFor'> &
  Omit<RichTextEditorProps, Bound>;

/** The editor follows the form's value, so `form.reset(loaded)` fills it: no remount or `key`. */
export const RichTextField = ({ label, description, required, ...editor }: RichTextFieldProps) => {
  const field = useFieldContext<RichTextDoc | null>();
  const error = useFieldError();
  return (
    <Field label={label} description={description} required={required} error={error}>
      <RichTextEditor
        {...editor}
        value={field.state.value ?? null}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        invalid={Boolean(error)}
      />
    </Field>
  );
};
