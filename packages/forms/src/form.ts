import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './context';
import { FormActions } from './FormActions';
import { CheckboxField } from './fields/CheckboxField';
import { CodeField } from './fields/CodeField';
import { DateField } from './fields/DateField';
import { HeadlineField } from './fields/HeadlineField';
import { MultiSelectField } from './fields/MultiSelectField';
import { NumberField } from './fields/NumberField';
import { PasswordField } from './fields/PasswordField';
import { RangeCalendarField } from './fields/RangeCalendarField';
import { RichTextField } from './fields/RichTextField';
import { SegmentedField } from './fields/SegmentedField';
import { SelectField } from './fields/SelectField';
import { SwitchField } from './fields/SwitchField';
import { TabsField } from './fields/TabsField';
import { TextAreaField } from './fields/TextAreaField';
import { TextField } from './fields/TextField';
import { ToggleRowField } from './fields/ToggleRowField';
import { SubmitButton } from './SubmitButton';

/**
 * Forms for web and native. Fields only pass value/onChange/onBlur through to @sprintstack/ui,
 * which resolves its .native.tsx components on mobile, so one binding serves both apps:
 *
 *   const form = useAppForm({ defaultValues, validators: { onChange: issueSchema }, onSubmit });
 *   <form.AppField name="summary">{(f) => <f.TextField label="Summary" required />}</form.AppField>
 *   <form.AppForm><form.SubmitButton>Create issue</form.SubmitButton></form.AppForm>
 */
export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    TextAreaField,
    CheckboxField,
    CodeField,
    NumberField,
    SelectField,
    MultiSelectField,
    DateField,
    RangeCalendarField,
    RichTextField,
    HeadlineField,
    SegmentedField,
    TabsField,
    SwitchField,
    ToggleRowField,
  },
  formComponents: { SubmitButton, FormActions },
});
