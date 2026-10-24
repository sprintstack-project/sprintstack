Gives each control a bold label, helper text and a red error message.

## Consumer provides
`label`, optional `description`, `error`, `required`, and one control as `children`.

## Web recipe (Base UI Field)
```tsx
import { Field } from "@base-ui/react/field";
<Field.Root invalid={!!error} className="flex flex-col gap-2">
  <Field.Label className="text-[17px] font-bold font-stretch-semi-condensed text-ink">{label}{required && <span aria-hidden className="ml-0.5 text-brand-ink">*</span>}</Field.Label>
  {children}
  <Field.Description className="text-meta font-semibold text-ink-muted font-stretch-semi-condensed">{description}</Field.Description>
  <Field.Error className="text-meta font-bold text-brand-ink font-stretch-semi-condensed">{error}</Field.Error>
</Field.Root>
```

## Rules
- Labels go above controls in sentence case, never as placeholders.
- Error messages say what to do ("Enter a valid email address") and replace the helper text.
- Space fields `space-5` apart, two columns on wide screens and one on phones.

## Native
`View className="gap-2"`, a bold label `Text` with `nativeID`, and an error `Text` with `accessibilityLiveRegion="polite"`.
