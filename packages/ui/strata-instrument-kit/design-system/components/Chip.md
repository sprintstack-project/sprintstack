Small readouts and controls: a **status meter**, a **priority tag**, a **token** (removable value or label), and **segmented filter toggles**.

## When to use
- **Status meter** (`dot` + tone): workflow state everywhere. Four segments fill as work moves right; Blocked shows ✕.
- **Priority** (`Strata.Priority`): `P0–P4` stamped tags.
- **Token** (`tone="neutral"`, `"outline"` for labels, `"accent"` for the active scope such as `sprint:24`) with `onRemove`.
- **Filter toggles** (`toggle`): inside an `st-seg` group above boards, with a global shortcut (`F`) that cycles focus to the group.
- **Key** (`tone="key"`): an inline issue key.

## Consumer provides
`children` (sentence case; status words are displayed uppercase), `tone`, `dot`, optional `progress` (0–4, overrides the tone's default fill), `avatar`, `size`, `onRemove`, or `toggle` + `pressed`/`onPressedChange` + `count`.

## Web recipe
```tsx
// Status meter
const fill = { neutral: 0, info: 2, review: 3, success: 4, warning: 2 };
<span className={`inline-flex items-center gap-2 label-caps ${tone === "success" ? "text-success" : ""}`}>
  <span aria-hidden className={`inline-flex gap-0.5 text-${tone}`}>{[0,1,2,3].map(i => <i key={i} className={`h-2.5 w-1 rounded-[1px] ${i < fill[tone] ? "bg-current" : "bg-line"}`} />)}</span>
  In progress
</span>

// Priority tag
<span className="inline-flex h-4 items-center rounded-sm border border-current px-1 font-mono text-[10px] font-medium text-priority-high">P1</span>

// Segmented filters (Base UI ToggleGroup)
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
<ToggleGroup multiple className="inline-flex gap-0.5 rounded-md border border-line bg-surface-sunken p-0.5">
  <Toggle value="mine" className="h-6 px-2 label-caps hover:bg-surface-hover hover:text-ink data-[pressed]:bg-surface-raised data-[pressed]:text-ink data-[pressed]:shadow-[0_0_0_1px_var(--line-strong)]">Mine 4</Toggle>
</ToggleGroup>
```

## Rules
- The meter never appears without its word, except in dense table cells, where the word becomes a tooltip and `aria-label`.
- Status colours are only for status. Labels are always neutral outline tokens.
- Tokens truncate at 160px.

## Native
Meter segments are four `View`s next to an uppercase Geist Mono `Text`. Segmented filters are a `Pressable` row with `accessibilityState={{ selected }}`.
