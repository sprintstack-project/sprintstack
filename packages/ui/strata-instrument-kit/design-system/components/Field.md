Wraps a control with its mono label, description and error. Labels can double as scrub handles for numbers.

## Consumer provides
`label`, optional `description`, `error`, `required`, `scrub` (NumberInput only: drag the label to change the value), one control as `children`.

## Web recipe (Base UI Field)
```tsx
import { Field } from "@base-ui/react/field";
<Field.Root invalid={!!error} className="flex flex-col gap-1.5">
  <Field.Label className="label-caps flex items-center gap-2">{label}{required && <span aria-hidden className="text-accent-ink">*</span>}</Field.Label>
  {children}
  <Field.Description className="text-small text-ink-muted">{description}</Field.Description>
  <Field.Error className="flex items-center gap-1 text-small text-danger-ink"><CircleAlert size={12} />{error}</Field.Error>
</Field.Root>
```
For scrubbing, wrap the label text in `NumberField.ScrubArea` (cursor `ew-resize`, with a `↔` glyph after the label).

## Rules
- Labels are always visible and sit above the control.
- The required mark is a lime `*`. If most fields are required, mark the optional ones "(optional)" instead.
- Validate on blur and on submit. Stack fields `space-4` apart.

## Native
`View className="gap-1.5"` with an uppercase Geist Mono label `Text` (`nativeID`) and the control (`accessibilityLabelledBy`). Errors use `accessibilityLiveRegion="polite"`.
