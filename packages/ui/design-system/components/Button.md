Fat pills with heavy condensed labels: **ink** primary, **red** action, ink-outline secondary, red-outline destructive, and a red underlined **link**.

## When to use
- `primary` (ink): the main action on most screens ("Create issue").
- `brand` (red): the one action you want people to take ("Start sprint", "Search"). At most one per view.
- `secondary` (2px ink outline): alternatives ("Cancel", "Clear filters").
- `danger` (red outline): destructive actions, confirmed in a dialog.
- `ghost`: icon buttons in bars; `link`: inline text actions ("View details", "See all").

## Consumer provides
`children`, `variant`, `size` (`sm` 40 / `md` 48 / `lg` 56), optional `icon`, `iconEnd`, `iconOnly`, `disabled`, `onClick`.

## Web recipe (Base UI Button)
```tsx
import { Button } from "@base-ui/react/button";
const v = { primary: "bg-ink text-on-ink hover:opacity-85", brand: "bg-brand text-on-brand hover:bg-brand-hover",
  secondary: "border-2 border-ink text-ink hover:bg-surface-hover", danger: "border-2 border-brand text-brand-ink hover:bg-brand-subtle", ghost: "hover:bg-surface-hover" };
<Button className={`inline-flex h-12 items-center gap-2 rounded-full px-6 text-[17px] font-extrabold font-stretch-condensed active:scale-[.98] ${v[variant]}
        focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring data-[disabled]:bg-surface-pressed data-[disabled]:text-ink-disabled`} />
```

## Rules
- Sentence-case labels; only headlines and badges are uppercase.
- Icon-only buttons are perfect circles, with their label as the accessible name.

## Native
`Pressable` with `rounded-full h-12 px-6`; scale to 0.98 on press.
