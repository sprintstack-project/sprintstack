Strata Instrument treats issue tracking like a precision tool: **dark by default, keyboard first, measured in mono**. Surfaces are graphite, edges are 1px lines, figures are tabular, and one electric-lime signal marks where you are and what will happen when you press Enter. Every control shows its shortcut. Status reads like a gauge, not a sticker.

It's built with **Base UI** (`@base-ui/react`, headless) styled with **Tailwind CSS** on the web, and with **React Native + NativeWind** on mobile, from the same tokens and props (`components/index.d.ts`). There are two themes: **Graphite** (`dark`, default) and **Daylight** (`light`).

## Principles

- **Keyboard first, pointer welcome.** Every action has a shortcut and shows it in a `kbd` hint: `C` creates, `/` searches, `⌘K` opens the command palette, `1–9` picks an option, `T` jumps to today. Lists always show their key legend in a footer.
- **Measured, not decorated.** Figures, keys, dates and labels are mono. Counts are exact (`3 / 3 WIP`, `30 / 48 pts`, `T-2D`). No illustrations, gradients or emoji.
- **One signal.** `accent` (lime) is the only bright colour: primary action, focus, current selection, today. If two things are lime, one of them is wrong.
- **Gauges over badges.** Status is a 4-segment meter that fills as work moves right, plus the word. Priority is a stamped `P0–P4` tag. Due dates count down (`T-2D`) and then up (`2D OVER`).
- **Dense and instant.** 30px controls, 13px body, 80ms linear colour transitions, no motion on layout.

## Content fundamentals

- **Sentence case** for titles, buttons and options ("Create issue"). **UPPERCASE mono** only for labels, headers, status words and units, applied by style (`label` / `uppercase`) so the source stays sentence case.
- **Terse and exact.** "3 / 3 WIP" beats "Column full". "Title is required" beats "Please enter a title".
- **Second person when speaking to people:** "You don't have access to PAY."
- **Units are lowercase and tight:** `3pt`, `1.5h`, `120%`. Time-relative values use `T-nD` / `nD OVER` in fields and `3m ago` in activity.
- **Dates:** `27 Oct 2026` in fields (zero-padded day: `05 Nov 2026`), ISO `2026-10-27` in exports and the date-picker input.
- **Empty states** state the fact in mono: `0 results for "foo"`, plus one action with its shortcut.
- **No emoji.**

## Colour

Both themes share every token name. Set `data-theme="dark"` (default) or `"light"` on `<html>`, or follow `prefers-color-scheme` when the user picks "System". All text colours below hold 4.5:1 on every neutral ground in both themes, and control edges and focus rings hold 3:1. That's 160 pairs checked.

**Grounds.** `canvas` behind everything, with a `grid-dot` dot grid (16px pitch) on boards. `surface` for rows, cards and panels. Inputs are an inset "screen" in `surface-sunken`. `surface-raised` + `shadow-popover` for popovers and the palette. Hover is `surface-hover`; keyboard highlight and press are `surface-pressed`.

**Lines.** `line` is the 1px structural line (panel edges, dividers, grid). `line-strong` is the edge of anything interactive. `line-hover` is that edge on hover.

**Ink.** `ink` for content, `ink-muted` for mono labels and metadata, `ink-placeholder`, `ink-disabled`.

**Signal.**
- `accent` lime is a fill in both themes: primary buttons, the selected day, the checked box. Text on it is always `on-accent` (near-black).
- Lime as text or as a thin mark uses `accent-ink`, which is lime in Graphite and deep olive in Daylight, because lime disappears on white. That covers focus rings (`focus-ring`), selected labels, today's underline and the selected-card brackets.
- `accent-subtle` washes selected rows.

**Readouts.** Each meaning has a base (meter segments, icons, short text), a `-subtle` wash and an `-ink` text colour for that wash:

| State | Token | Meter | Word |
| --- | --- | --- | --- |
| To do | `ink-muted` | ▯▯▯▯ | TO DO |
| In progress | `info` (cyan) | ▮▮▯▯ | IN PROGRESS |
| In review | `review` (violet) | ▮▮▮▯ | IN REVIEW |
| Done | `success` (mint) | ▮▮▮▮ | DONE |
| Blocked | `danger` | ✕ | BLOCKED |
| At risk / due soon | `warning` (amber) | ▮▮▯▯ | AT RISK |

The number of filled segments carries the state on its own, for colour-blind users and in greyscale screenshots. Blocked swaps the meter for ✕.

**Priority** tags: `P0` `priority-highest` (danger), `P1` high (amber), `P2` medium (ink), `P3` and `P4` low/lowest (muted). The number is the meaning; colour only adds urgency.

## Typography

**Geist** and **Geist Mono** (Google Fonts; `@expo-google-fonts/geist` and `/geist-mono` on native).

| Style | Size / line | Weight | Use |
| --- | --- | --- | --- |
| `display` | 22/28, −0.02em | 600 | Page title, one per screen |
| `title` | 16/22 | 600 | Issue title in the detail view, dialogs |
| `body` | 13/20 | 400 | Default, including issue titles in rows |
| `body-strong` | 13/20 | 500 | Emphasis, buttons, selected option |
| `small` | 12/16 | 400 | Descriptions and errors |
| `input-touch` | 16/22 | 400 | Inputs on touch and native |
| `label` | mono 11/16, +0.06em, uppercase | 500 | Labels, headers, status words |
| `meta` | mono 12/16, tabular | 400 | Keys, figures, dates, counts |
| `kbd` | mono 10/14 | 500 | Shortcut hints |
| `code` | mono 12/18 | 400 | Code |

Hierarchy comes from mono labels and lines, not from big type. Nothing on a working screen is larger than `display`.

## Spacing, size and shape

A 4px grid that matches Tailwind's default spacing scale (`p-3` = 12px): `space-0.5` 2 · `1` 4 · `1.5` 6 · `2` 8 · `3` 12 · `4` 16 · `6` 24 · `8` 32.

- Controls: `control-sm` 24, `control-md` 30 (default), `control-lg` 44 (touch and native). List rows are `row` (36px).
- Inside controls: `space-2` horizontal padding and icon gap. Panels pad `space-3`. Fields stack at `space-4`.
- Board columns gap `space-3` on the dot grid (`grid-pitch` 16px).

Corners are tight: `radius-sm` 2px (tags, kbd, checkboxes, meter segments), `radius-md` 3px (controls, cards, popovers), `radius-lg` 6px (palette, dialogs, sheets). `radius-full` is for avatars only.

## Elevation

Flat panels with 1px lines. Only floating things get `shadow-popover` (it includes a 1px hairline, so popovers keep an edge in Graphite). A dragged card gets `shadow-drag`: a lime outline plus lift. The selected card gets lime crop-mark brackets at its four corners, not a coloured fill. Layers: `z-sticky` 10, `z-popover` 50, `z-palette` 90, `z-dialog` 100, `z-toast` 200.

## Interaction states

- **Hover:** fills go to `surface-hover`; edges to `line-hover`; primary to `accent-hover`.
- **Keyboard highlight:** `surface-pressed`. It's deliberately stronger than hover, so the keyboard cursor is never ambiguous.
- **Focus:** inputs get a `focus-ring` edge plus a 1px outer ring. Everything else gets a 2px `focus-ring` outline at 2px offset on `:focus-visible`.
- **Open:** a trigger with an open popup keeps its focus ring (`data-popup-open`).
- **Invalid:** `danger` edge and ring, message below in `danger-ink` with an alert icon. Validate on blur and submit.
- **Disabled:** dashed `line` edge, transparent fill, `ink-disabled`.
- **Motion:** 80ms linear on colour; popups fade in over 80ms with no movement. Respect `prefers-reduced-motion`.

## Iconography

**Lucide** (`lucide-react`, `lucide-react-native`) at 14px, `strokeWidth={1.5}`, `currentColor`, used for actions and affordances only. Status uses the meter and priority uses `P0–P4`, never icons. Shortcut hints use the `Kbd` element with real key glyphs: `⌘ ⌥ ⇧ ↵ ⌫ esc ↑↓`. Show `Ctrl` instead of `⌘` on Windows and Linux.

## Tailwind setup (web)

```css
@import "tailwindcss";
@import "./tokens.css"; /* [data-theme="dark"] is :root; [data-theme="light"] overrides */
@custom-variant light (&:where([data-theme="light"], [data-theme="light"] *));

@theme inline {
  --font-sans: Geist, -apple-system, "Segoe UI", system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --color-canvas: var(--canvas);  --color-grid-dot: var(--grid-dot);
  --color-surface: var(--surface);  --color-surface-sunken: var(--surface-sunken);  --color-surface-raised: var(--surface-raised);
  --color-surface-hover: var(--surface-hover);  --color-surface-pressed: var(--surface-pressed);
  --color-line: var(--line);  --color-line-strong: var(--line-strong);  --color-line-hover: var(--line-hover);
  --color-ink: var(--ink);  --color-ink-muted: var(--ink-muted);  --color-ink-placeholder: var(--ink-placeholder);  --color-ink-disabled: var(--ink-disabled);
  --color-accent: var(--accent);  --color-accent-hover: var(--accent-hover);  --color-on-accent: var(--on-accent);
  --color-accent-subtle: var(--accent-subtle);  --color-accent-ink: var(--accent-ink);  --color-focus-ring: var(--focus-ring);
  /* danger / warning / info / review / success (+ -subtle, -ink) and priority-* the same way */
  --radius-sm: 2px;  --radius-md: 3px;  --radius-lg: 6px;
  --shadow-popover: var(--shadow-popover);  --shadow-drag: var(--shadow-drag);
  --text-body: 13px;  --text-body--line-height: 20px;
  --text-small: 12px; --text-small--line-height: 16px;
  --text-meta: 12px;  --text-meta--line-height: 16px;
  --text-label: 11px; --text-label--line-height: 16px; --text-label--letter-spacing: 0.06em;
  --text-kbd: 10px;   --text-kbd--line-height: 14px;
  --text-title: 16px; --text-title--line-height: 22px;
  --text-display: 22px; --text-display--line-height: 28px;
}

@utility label-caps { font-family: var(--font-mono); font-size: 11px; line-height: 16px; letter-spacing: .06em; text-transform: uppercase; font-weight: 500; color: var(--ink-muted); }
@utility screen { background: var(--surface-sunken); border: 1px solid var(--line-strong); border-radius: 3px;
  &:hover { border-color: var(--line-hover); }
  &:focus-within, &[data-popup-open] { border-color: var(--focus-ring); box-shadow: 0 0 0 1px var(--focus-ring); }
  &[data-invalid] { border-color: var(--danger); box-shadow: 0 0 0 1px var(--danger); }
  &[data-disabled] { border-style: dashed; border-color: var(--line); background: transparent; color: var(--ink-disabled); } }
@utility dot-grid { background-image: radial-gradient(var(--grid-dot) 1px, transparent 1.2px); background-size: 16px 16px; }
```

`tokens.css` declares Graphite on `:root`, so the app is dark with no attribute set. Colours resolve through variables, so classes like `bg-surface text-ink` need no `dark:` or `light:` variants. `screen`, `label-caps` and `dot-grid` are the three shared recipes.

### Theme switching

```ts
// "system" | "dark" | "light"; persist the choice, default "dark"
const mq = matchMedia("(prefers-color-scheme: light)");
function apply(pref) { document.documentElement.dataset.theme = pref === "system" ? (mq.matches ? "light" : "dark") : pref; }
```
Set the attribute in an inline script in `<head>` before first paint so there's no flash.

## Base UI conventions

| Attribute | Part | Instrument style |
| --- | --- | --- |
| `data-highlighted` | Select/Combobox/Menu item | `bg-surface-pressed` |
| `data-selected` | Item | `text-accent-ink font-medium` + check at the end, before the `kbd` |
| `data-popup-open` | Trigger, Input | the `screen` focus ring |
| `data-invalid` | parts in `Field.Root` | `danger` edge and ring |
| `data-disabled` | any | dashed `line`, `text-ink-disabled` |
| `data-pressed` | Toggle | raised segment with a lime pip |
| `data-starting-style` | Popup | `opacity-0` (fade only) |

Each control lives in `Field.Root` → `Field.Label` (`label-caps`) → control → `Field.Description` / `Field.Error`. Popups use `Portal` + `Positioner sideOffset={4}` and end with a key-legend footer. Register shortcuts with one hotkey layer (e.g. `tinykeys`) and mirror them in `aria-keyshortcuts`.

## React Native

The props contract is the same; only `ui/` differs.

| Component | Web (Base UI) | Native |
| --- | --- | --- |
| Card | `<article>` / `<section>` | `Pressable` / `View`, 1px `line` border; brackets drawn as four absolutely positioned `View`s |
| Field | `Field.*` | `View` + label `Text` (`nativeID`) + control (`accessibilityLabelledBy`) |
| Input, TextArea | `Input`, `Field.Control` | `TextInput` in a `bg-surface-sunken border border-line-strong` shell; TextArea status bar is a `View` row |
| NumberInput | `NumberField.*` | `TextInput keyboardType="decimal-pad"` + a two-button rack (`hitSlop`) |
| Select | `Select.*` | `Pressable` trigger → bottom sheet; number shortcuts become hardware-keyboard shortcuts on iPad |
| MultiSelect | `Combobox multiple` + `Chips` | tokens in the trigger → full-height sheet with search, checkboxes and an "N selected · Done" bar |
| Chip | `<span>` / `Toggle` | `View`s for meter segments + `Text`; segmented filters via a `Pressable` row |
| DatePicker | `Popover` + react-day-picker + parser | sheet with the same type-a-date field on top of the grid (react-native-calendars) |
| Button | `Button` | `Pressable`; `kbd` hints hidden unless a hardware keyboard is attached |

Use **NativeWind** with the same theme. Generate `tokens.ts` (Graphite and Daylight objects) from `tokens.json` and apply with NativeWind `vars()`. Default to Graphite and follow `useColorScheme()` only when the user picks "System". On native: controls are `control-lg`, inputs use `input-touch`, and popovers are bottom sheets.

## Accessibility

- Every control has a visible label. Shortcut hints are extras: every shortcut action is also reachable by pointer and screen reader, and `aria-keyshortcuts` announces it.
- Shortcuts don't fire while typing in a field, except Escape and ⌘/Ctrl combinations.
- Status, priority and due dates are always text, never only colour or meter fill.
- Hit targets are at least 44px on touch (`hitSlop` on token remove buttons and steppers), and at least 24px or spaced 24px apart on pointer.
- Graphite and Daylight both meet AA. Offer "System" in settings and remember the choice.
