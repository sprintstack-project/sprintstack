An action with an optional shortcut hint. Lime fill for the one primary action, 1px outline for the rest.

## When to use
- `primary` (lime): the main action on the screen ("Create issue C", "Start sprint").
- `secondary` (outline): other actions.
- `ghost`: toolbars, panel headers, icon-only buttons.
- `danger`: destructive confirmations inside dialogs.

## Consumer provides
`children` (sentence case), `variant`, `size` (`sm` 24 / `md` 30 / `lg` 44), optional `icon`, `shortcut` (shown as `kbd`, wired to `aria-keyshortcuts`), `iconOnly`, `disabled`, `onClick`.

## Web recipe (Base UI Button)
```tsx
import { Button } from "@base-ui/react/button";
const v = { primary: "bg-accent text-on-accent hover:bg-accent-hover", secondary: "border border-line-strong bg-surface text-ink hover:bg-surface-hover hover:border-line-hover",
            ghost: "text-ink hover:bg-surface-hover active:bg-surface-pressed", danger: "bg-danger text-on-danger" };
<Button aria-keyshortcuts={shortcut} className={`inline-flex h-[30px] items-center gap-2 rounded-md pl-3 pr-2 text-body font-medium ${v[variant]}
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring
        data-[disabled]:border data-[disabled]:border-line data-[disabled]:bg-surface-sunken data-[disabled]:text-ink-disabled`}>
  {children}{shortcut && <kbd className="kbd">{shortcut}</kbd>}
</Button>
```

## Rules
- One lime button per view. Every primary action has a shortcut.
- Kbd hints on lime use a dark translucent border so they stay legible in both themes.

## Native
`Pressable` at `h-11`. Hide `kbd` hints unless a hardware keyboard is attached.
