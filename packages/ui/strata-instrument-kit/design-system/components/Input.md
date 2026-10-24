A single-line "screen": a sunken field with a 1px edge, optional mono prefix and a shortcut hint that focuses it from anywhere.

## Consumer provides
`id`, `value`/`onChange` or `defaultValue`, `placeholder`, `size`, `invalid`, `disabled`, optional `leadingIcon` (search only), `prefix` (mono context such as `git:`, `https://`, `PAY-`), `mono` (for keys, branches, IDs), `shortcut` (a global key that focuses the field, shown as `kbd` until focused), `trailing`.

## Web recipe (Base UI Input)
```tsx
import { Input } from "@base-ui/react/input";
<div data-invalid={invalid || undefined} data-disabled={disabled || undefined} className="screen flex h-[30px] w-full items-center gap-2 px-2">
  {prefix && <span className="self-stretch flex items-center border-r border-line pr-2 font-mono text-meta text-ink-muted">{prefix}</span>}
  {leadingIcon && <Search size={14} strokeWidth={1.5} className="text-ink-muted" />}
  <Input className="h-full min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-placeholder pointer-coarse:text-[16px]" />
  {shortcut && <kbd className="kbd">{shortcut}</kbd>}
</div>
```
Sizes: `h-6` (sm), `h-[30px]` (md), `h-11` (lg / touch).

## Do / don't
- Do use `mono` for anything people copy and paste: keys, branches, URLs, IDs.
- Do hide the `kbd` hint while the field has focus or a value.
- Don't use the placeholder as the label.

## Native
`TextInput` in a `View className="h-11 rounded-md border border-line-strong bg-surface-sunken px-2"` with `text-[16px]`. On focus, swap to `border-focus-ring`. Shortcut hints are hidden unless a hardware keyboard is attached.
