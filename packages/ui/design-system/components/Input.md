A tall, soft text field (56px, 16px corners, 1.5px edge), with a full-pill search variant that holds its own action button.

## Consumer provides
`id`, `value`/`onChange` or `defaultValue`, `placeholder` (an example: "E.g. checkout bug"), `invalid`, `disabled`, optional `leadingIcon`, `trailing`, `pill` (search bar style, with a `brand` small button as `trailing`).

## Web recipe (Base UI Input)
```tsx
import { Input } from "@base-ui/react/input";
<div data-invalid={invalid || undefined} data-disabled={disabled || undefined} className="field flex items-center gap-3 px-5">
  {leadingIcon && <Search size={24} className="text-ink-muted" />}
  <Input className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-ink-placeholder" />
  {trailing}
</div>
// Search pill: add rounded-full pr-1.5 and put <Button variant="brand" size="sm">Search</Button> inside.
```

## Do / don't
- Do use real examples as placeholders. Don't use them as labels.
- Don't shrink fields below 56px. The generous size is part of the look and keeps touch targets right.

## Native
`TextInput` inside a `View className="h-14 flex-row items-center gap-3 rounded-2xl border-[1.5px] border-line-strong bg-surface px-5"`. On focus, swap to `border-ink`.
