import { Field as BaseField } from '@base-ui/react/field';
import { Icon } from '../Icon/Icon';
import type { FieldProps } from '../types';

const meta = 'text-meta font-stretch-semi-condensed';

export function Field({ label, htmlFor, description, error, required, children }: FieldProps) {
  const invalid = Boolean(error);

  return (
    <BaseField.Root invalid={invalid} className="flex min-w-0 flex-col gap-2">
      <BaseField.Label
        // An explicit undefined would override the id Base UI wires up.
        {...(htmlFor && { htmlFor })}
        className="text-[17px] leading-[22px] font-bold font-stretch-semi-condensed text-ink"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-brand-ink">
            *
          </span>
        )}
      </BaseField.Label>
      {children}
      {/* The error replaces the helper text rather than stacking under it. */}
      {invalid ? (
        <BaseField.Error
          match
          className={`flex items-center gap-1 font-bold text-brand-ink ${meta}`}
        >
          <Icon name="circle-alert" size="sm" />
          {error}
        </BaseField.Error>
      ) : (
        description && (
          <BaseField.Description className={`font-semibold text-ink-muted ${meta}`}>
            {description}
          </BaseField.Description>
        )
      )}
    </BaseField.Root>
  );
}
