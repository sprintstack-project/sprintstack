Pills and badges: **filter pills** you toggle, **value pills** (optionally removable), condensed caps **status badges**, and **priority** marks.

## When to use
- **Filter pill** (`toggle`): outline pill, filled `ink` when on. Put them in a horizontally scrolling row above lists, with "Clear" as a red link at the end.
- **Value pill**: `neutral` (grey), `ink` (black), `outline`; add `onRemove` for active filters and picked values.
- **Status badge** (`SprintStack.Badge` or `Chip dot` with a tone): `NEW`, `TO DO`, `IN PROGRESS`, `IN REVIEW`, `DONE`, `BLOCKED`, `AT RISK`.
- **Priority** (`SprintStack.Priority`): an arrow plus its name.

## Consumer provides
`children`, `tone` (`neutral` | `ink` | `outline` | `accent` | `key`, or a status tone with `dot`), optional `avatar`, `onRemove`, `toggle` + `pressed`/`onPressedChange` + `count`.

## Web recipe
```tsx
// Filter pill (Base UI Toggle)
import { Toggle } from "@base-ui/react/toggle";
<Toggle className="h-10 rounded-full border-[1.5px] border-line-strong bg-surface px-4 font-bold font-stretch-semi-condensed hover:bg-surface-hover
       data-[pressed]:border-ink data-[pressed]:bg-ink data-[pressed]:text-on-ink">Assigned to me</Toggle>

// Status badge
const tone = { neutral: "bg-neutral-subtle text-ink-muted", info: "bg-info-subtle text-info-ink", review: "bg-warning-subtle text-warning-ink",
  success: "bg-success-subtle text-success-ink", danger: "bg-brand text-on-brand", warning: "bg-warning-subtle text-warning-ink" };
<span className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-extrabold uppercase tracking-[.03em] font-stretch-condensed ${tone.review}`}>In review</span>
```

## Rules
- Badges are always words, never just a coloured dot.
- Keep pills to 1–3 words. Never wrap a pill's text.

## Native
Filter pills are `Pressable`s in a horizontal `ScrollView` with `accessibilityState={{ selected }}`. Badges are `View` + uppercase `Text`.
