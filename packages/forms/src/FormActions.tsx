import { Button, ButtonGroup } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { SubmitButton } from './SubmitButton';

export interface FormActionsProps {
  /** The submit button's text. Default "Save changes". */
  children?: ReactNode;
  /** Shows Discard, which should put back what was saved, e.g. `() => form.reset(saved)`. */
  onDiscard?: () => void;
}

/** The form's submit button and, given `onDiscard`, a Discard button beside it. */
export const FormActions = ({ children = 'Save changes', onDiscard }: FormActionsProps) => (
  <ButtonGroup>
    <SubmitButton size="lg">{children}</SubmitButton>
    {onDiscard && (
      <Button variant="secondary" size="lg" onClick={onDiscard}>
        Discard
      </Button>
    )}
  </ButtonGroup>
);
