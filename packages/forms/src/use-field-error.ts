import { useSelector } from '@tanstack/react-form';
import { useFieldContext } from './context';

/**
 * The field's first error, once it should be shown: after the person leaves the field or tries to
 * submit ("validate on blur and submit"). Validation itself can run on every change, so an error
 * clears as soon as it's fixed. Schema errors arrive as issues; plain validators return strings.
 */
export const useFieldError = (): string | undefined => {
  const field = useFieldContext<unknown>();
  const submitted = useSelector(field.form.store, (state) => state.submissionAttempts > 0);
  const { errors, isBlurred } = field.state.meta;
  if (!(isBlurred || submitted) || errors.length === 0) return undefined;
  const first = errors[0] as string | { message?: string } | undefined;
  return typeof first === 'string' ? first : first?.message;
};
