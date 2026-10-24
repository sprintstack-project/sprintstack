SprintStack Bold is loud where it should be and calm everywhere else. Headlines shout in condensed heavy capitals, actions are fat pills, cards are soft white sheets with hairline edges, and one signal red marks what matters: the action, the link, the current step, the selected day. Behind that, the working surface stays white, roomy and easy to scan.

It's built with **Base UI** (`@base-ui/react`, headless) styled with **Tailwind CSS** on the web, and with **React Native + NativeWind** on mobile, from the same tokens and props (`components/index.d.ts`). There are two themes: **Day** (`light`, default) and **Night** (`dark`).

## Principles

- **Shout once per screen.** One uppercase `headline` per screen, and at most one `poster` tile. Everything else is sentence case.
- **Red means go.** `brand` is the main call to action, links, the active nav item, the current step, the selected date and progress. Errors also use red, but always with words and an icon, never by colour alone.
- **Ink for structure.** Black (`ink`) fills primary buttons, selected filter pills, checkboxes and the dark tile. In Night, ink flips to white, so the same classes work in both themes.
- **Soft shapes, firm edges.** Big radii (cards `radius-xl` 20, tiles `radius-2xl` 28, everything interactive a full pill) with crisp 1px hairlines. No drop shadows on cards; only menus and toasts float.
- **Generous by default.** 56px fields, 48px buttons and 16px text work the same on desktop and touch, so one layout serves web and native.

## Content fundamentals

- **Headlines and badges:** UPPERCASE, condensed, short. `SPRINT 24 (128)`, `NO RESULTS.`, `IN REVIEW`. Posters end with a full stop: `SHIP IT. SPRINT 24.`
- **Everything else:** sentence case. "Create issue", "Story points", "Assigned to me".
- **Verbs on buttons:** "Start sprint", "View issue", "Clear filters". Text links are bold, red and underlined: "See all", "View details".
- **Friendly second person:** "We'll let the reporter know." "Your search didn't match any issues." Errors say what to do: "Enter a valid email address".
- **Metadata joins with a middle dot:** `PAY-1477 · Payments`. Use relative time on cards ("Updated 2d ago") and full dates in fields ("30 Oct 2026").
- **No emoji.** Use icons from the icon set.

## Colour

Every text colour below holds 4.5:1 on every neutral ground in both themes. Control edges, focus and status marks hold 3:1. That's 134 pairs checked.

**Grounds.** `canvas` and `surface` are white in Day. `surface-muted` (warm grey `#f1f0f0`) is for grey tiles, accordion rows and profile-task cards, and for the off state of toggles and month pills. Hover and keyboard highlight use `surface-hover`; press uses `surface-pressed`.

**Edges.** `line` (`#cfcccc`) is the hairline on cards, dividers and empty progress tracks. `line-strong` is the 1.5px edge of anything you type into or open, darkened from the screenshots' `#aba4a4` so it meets the 3:1 boundary minimum.

**Ink.** `ink` for headlines, body text and black fills (with `on-ink` text). `ink-muted` (warm grey) for locations, timestamps and helper text. `ink-placeholder` for placeholders and `ink-disabled` for disabled labels.

**Signal red.**
- `brand` `#d82e45` fills tiles, the action button, selected dates, current steps, progress and toggles. Text on it is `on-brand` white (4.6:1).
- Red as text uses `brand-ink`, slightly deeper in Day and lifted in Night, for links, destructive rows and errors.
- `brand-subtle` is the pink error-toast wash.

**Focus** is `ink` (black in Day, white in Night), not red, so a focused field never looks like an invalid one.

**Status badges** are condensed caps on tinted pills:

| Badge | Fill / text | Use |
| --- | --- | --- |
| NEW | `brand` / `on-brand` | Just created |
| TO DO | `neutral-subtle` / `ink-muted` | Not started; also CLOSED |
| IN PROGRESS | `info-subtle` / `info-ink` (violet) | Being worked on |
| IN REVIEW | `warning-subtle` / `warning-ink` (ochre) | Waiting on review |
| DONE | `success-subtle` / `success-ink` (green) | Finished |
| BLOCKED | `brand` / `on-brand` | Stopped by something |
| AT RISK | `warning-subtle` / `warning-ink` | Due soon or slipping |

The word carries the meaning; the tint only helps you scan. Banners use the same pairs: an `-subtle` fill, a 1px border in the base colour, an icon and a bold condensed caps title.

## Typography

One family, **Archivo** (variable, on Google Fonts; widths 62–125%, weights 100–900), set at three widths:

| Style | Size / line | Weight · width | Use |
| --- | --- | --- | --- |
| `poster` | 48 / 0.92 | 800 · 75% · UPPERCASE | Slogans on red or black tiles; second line often red |
| `headline` | 36 / 1 | 800 · 75% · UPPERCASE | Page and section headlines |
| `title` | 24 / 1.15 | 800 · 75% | Card titles, app-bar titles |
| `heading` | 18 / 1.25 | 700 · 75% | Accordion and list-row headings |
| `eyebrow` | 13 / 16 | 700 · 87.5% · UPPERCASE | Overlines above headlines and inside tiles |
| `badge` | 12 / 16 | 800 · 75% · UPPERCASE | Status badges |
| `body` | 16 / 24 | 400 · 100% | Values, options, descriptions |
| `body-strong` | 16 / 24 | 700 · 87.5% | Field labels, meta values |
| `meta` | 14 / 20 | 600 · 87.5% | Timestamps, helper text, counts |
| `button` | 16 / 20 | 800 · 75% | Button labels |

In CSS, set width with `font-stretch: 75%` (Tailwind `font-stretch-condensed`) or `87.5%` (`font-stretch-semi-condensed`). On React Native, load **Archivo Condensed** (or Archivo with `fontVariationSettings` on new architecture) for the 75% styles, and regular Archivo for the rest.

## Spacing, size and shape

A 4px grid that matches Tailwind's default spacing scale (`p-6` = 24px): `space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `12` 48.

- Cards pad `space-6`; tiles pad `space-8`. Grids gap `space-5`.
- Fields: label to control `space-2`; field to field `space-5`.
- Controls: inputs, selects, steppers and date pickers are `control-lg` (56px); buttons are `control-md` (48px), or `control-sm` (40px) for small buttons and filter pills.

| Radius | Value | Use |
| --- | --- | --- |
| `radius-md` | 12 | Menu-row highlight |
| `radius-lg` | 16 | Inputs, selects, steppers, popovers, upload zones |
| `radius-xl` | 20 | Cards and app bars |
| `radius-2xl` | 28 | Solid tiles and the bottom nav bar |
| `radius-full` | — | Buttons, chips, badges, avatars, toggles, progress bars, date cells |

## Elevation

Cards are flat: `surface` plus a `line` hairline, no shadow. Menus and the date picker use `shadow-popover` with a `line` border; toasts use `shadow-toast`. Solid tiles sit flat on the page. Layers: `z-popover` 50, `z-nav` 60, `z-dialog` 100, `z-toast` 200.

## Interaction states

- **Hover:** rows and ghost buttons fill `surface-hover`; field edges darken to `ink-muted`; the red action darkens to `brand-hover`.
- **Focus:** fields get an `ink` edge plus a 1px ring. Everything else gets a 2px `focus-ring` outline at 3px offset on `:focus-visible`.
- **Selected:** filter pills fill `ink`. A menu option shows a red check on the right. The selected card gets a 2px `ink` border.
- **Invalid:** red edge and ring, with a bold red message below. Validate on blur and submit.
- **Disabled:** `surface-pressed` fill and `ink-disabled` label for buttons; `surface-muted` fill for fields.
- **Press:** buttons scale to 98%.
- **Motion:** 120–140ms ease-out; menus drop 6px into place. Respect `prefers-reduced-motion`.

## Iconography

**Lucide** (`lucide-react`, `lucide-react-native`) at 24px with `strokeWidth={2}` and round joins, coloured by `currentColor`. Icons sit in `ink` in rows and menus, `ink-muted` in fields and meta rows, and red only on destructive rows and the active nav item. Watch/save uses a bookmark that fills when active. The previews here draw simplified stand-ins; ship the real package. There's no logo in this system: set the product name in `headline` type until you have a mark.

## Tailwind setup (web)

```css
@import "tailwindcss";
@import "./tokens.css"; /* :root = Day; [data-theme="dark"] = Night */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
  --font-sans: Archivo, -apple-system, "Segoe UI", system-ui, sans-serif;
  --font-display: Archivo, "Arial Narrow", system-ui, sans-serif;
  --color-canvas: var(--canvas);  --color-surface: var(--surface);  --color-surface-muted: var(--surface-muted);
  --color-surface-hover: var(--surface-hover);  --color-surface-pressed: var(--surface-pressed);
  --color-line: var(--line);  --color-line-strong: var(--line-strong);
  --color-ink: var(--ink);  --color-ink-muted: var(--ink-muted);  --color-ink-placeholder: var(--ink-placeholder);
  --color-ink-disabled: var(--ink-disabled);  --color-on-ink: var(--on-ink);
  --color-brand: var(--brand);  --color-brand-hover: var(--brand-hover);  --color-on-brand: var(--on-brand);
  --color-brand-ink: var(--brand-ink);  --color-brand-subtle: var(--brand-subtle);  --color-focus-ring: var(--focus-ring);
  /* warning / success / info (+ -subtle, -ink), neutral-subtle the same way */
  --radius-md: 12px;  --radius-lg: 16px;  --radius-xl: 20px;  --radius-2xl: 28px;
  --shadow-popover: var(--shadow-popover);  --shadow-toast: var(--shadow-toast);
  --text-poster: 48px;  --text-poster--line-height: 0.92;
  --text-headline: 36px; --text-headline--line-height: 1;
  --text-title: 24px;   --text-title--line-height: 1.15;
  --text-heading: 18px; --text-heading--line-height: 1.25;
  --text-meta: 14px;    --text-meta--line-height: 20px;
}

@utility headline { font-family: var(--font-display); font-weight: 800; font-stretch: 75%; text-transform: uppercase; }
@utility field { min-height: 56px; border: 1.5px solid var(--line-strong); border-radius: 16px; background: var(--surface);
  &:hover { border-color: var(--ink-muted); }
  &:focus-within, &[data-popup-open] { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
  &[data-invalid] { border-color: var(--brand); box-shadow: 0 0 0 1px var(--brand); }
  &[data-disabled] { background: var(--surface-muted); border-color: var(--line); color: var(--ink-disabled); } }
@utility link { font-weight: 800; font-stretch: 75%; color: var(--brand-ink); text-decoration: underline 2px; text-underline-offset: 4px; white-space: nowrap; }
```

Colours resolve through variables, so `bg-surface text-ink` works in both themes with no `dark:` variants. Set `data-theme` on `<html>` from the user's choice, defaulting to `prefers-color-scheme`, in an inline `<head>` script to avoid a flash.

## Base UI conventions

| Attribute | Part | Bold style |
| --- | --- | --- |
| `data-highlighted` | Select/Combobox/Menu item | `bg-surface-hover rounded-md` (hides the neighbouring hairlines) |
| `data-selected` | Item | red `Check` at the end; multi-select uses a filled ink checkbox |
| `data-popup-open` | Trigger | `field` focus edge; caret rotates 180° |
| `data-invalid` | parts in `Field.Root` | red edge and ring |
| `data-disabled` | any | see Interaction states |
| `data-pressed` | Toggle (filter pill) | `bg-ink text-on-ink border-ink` |
| `data-starting-style` | Popup | `opacity-0 -translate-y-1.5` |

Every control lives in `Field.Root` → `Field.Label` (`body-strong`) → control → `Field.Description` (`meta`) / `Field.Error` (bold `brand-ink`). Popups use `Portal` + `Positioner sideOffset={8}`.

## React Native

The props contract is the same; only `ui/` differs.

| Component | Web (Base UI) | Native |
| --- | --- | --- |
| Card | `<article>` / `<section>`; tile variant | `Pressable` / `View` with 1px `line` border, `rounded-[20px]`; tiles `rounded-[28px]` |
| Field | `Field.*` | `View` + label `Text` (`nativeID`) + control (`accessibilityLabelledBy`) |
| Input, TextArea | `Input`, `Field.Control` | `TextInput` in a 56px `field` shell (`multiline` for TextArea) |
| NumberInput | `NumberField.*` | three-segment row: `Pressable` − / `TextInput` / `Pressable` + |
| Select | `Select.*` | `Pressable` trigger → bottom sheet using the same menu rows |
| MultiSelect | `Combobox multiple` + `Chips` | ink pills in the trigger → sheet with checkbox rows and a "Done" pill |
| Chip | `<span>` / `Toggle` | `View`/`Text`; filter pills are `Pressable` in a horizontal `ScrollView` |
| DatePicker | `Popover` + react-day-picker (+ month grid) | sheet with the same round-day grid (react-native-calendars) |
| Button | `Button` | `Pressable` with `rounded-full`; scale 0.98 on press |

Use **NativeWind** with the same theme. Generate `tokens.ts` (Day and Night objects) from `tokens.json` and apply with NativeWind `vars()`, switching on `useColorScheme()` or the user's setting. The sizes are already touch-friendly, so native uses the same control heights as web.

## Accessibility

- Every control has a visible label. Placeholders are examples ("E.g. checkout bug"), never labels.
- Status is always a word. Overdue dates say "Overdue". Priority shows its name next to its arrow.
- White on `brand` is 4.6:1. Keep red-filled text bold or ≥16px, and never put red text on red tints other than `brand-subtle`.
- Hit targets are at least 44px everywhere (the default sizes already are); chip remove buttons get extra padding via `hitSlop` on native.
- Focus is always visible as an ink outline.
