import { Button, type ButtonProps } from '@sprintstack/ui';
import { useFormContext } from './context';

export type SubmitButtonProps = Omit<ButtonProps, 'onClick' | 'disabled'>;

/**
 * Validates and submits the form. It stays enabled when the form is invalid, so pressing it shows
 * every error; it's only disabled while a submit is in flight.
 */
export const SubmitButton = ({ variant = 'brand', children, ...button }: SubmitButtonProps) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          {...button}
          variant={variant}
          disabled={isSubmitting}
          onClick={() => form.handleSubmit()}
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};
