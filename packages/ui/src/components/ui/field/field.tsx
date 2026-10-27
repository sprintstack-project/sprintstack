'use client';

import { Field as BaseField } from '@base-ui/react/field';
import type { FieldProps } from '@ui/types';
import { CircleAlert } from 'lucide-react';
import { createContext, useContext, useId } from 'react';

const meta = 'text-meta font-stretch-semi-condensed';

interface FieldIds {
  labelId: string;
  /** The helper text or error, whichever is showing. */
  hintId?: string;
  invalid: boolean;
}

// Base UI links its own controls (Input, Select, NumberField) automatically. Controls built on
// other primitives, like DatePicker's popover trigger, read these ids to label themselves.
const FieldContext = createContext<FieldIds | null>(null);

export const useField = () => {
  return useContext(FieldContext);
};

const Field = ({ label, htmlFor, description, error, required, children }: FieldProps) => {
  const invalid = Boolean(error);
  const labelId = useId();
  const hintId = useId();
  const hasHint = invalid || Boolean(description);

  return (
    <BaseField.Root invalid={invalid} className="flex min-w-0 flex-col gap-2">
      <FieldContext.Provider value={{ labelId, hintId: hasHint ? hintId : undefined, invalid }}>
        <BaseField.Label
          id={labelId}
          // An explicit undefined would override the id Base UI wires up.
          {...(htmlFor && { htmlFor })}
          className="text-[1.0625rem] leading-5.5 font-bold font-stretch-semi-condensed text-ink"
        >
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-brand-ink">
              *
            </span>
          )}
        </BaseField.Label>
        {children}
      </FieldContext.Provider>
      {/* The error replaces the helper text rather than stacking under it. */}
      {invalid ? (
        <BaseField.Error
          id={hintId}
          match
          className={`flex items-center gap-1 font-bold text-brand-ink ${meta}`}
        >
          <CircleAlert aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
          {error}
        </BaseField.Error>
      ) : (
        description && (
          <BaseField.Description id={hintId} className={`font-semibold text-ink-muted ${meta}`}>
            {description}
          </BaseField.Description>
        )
      )}
    </BaseField.Root>
  );
};

export default Field;
