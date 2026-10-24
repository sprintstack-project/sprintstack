import { createFormHookContexts } from '@tanstack/react-form';

// Kept apart from form.ts so field components can read the contexts without an import cycle.
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
