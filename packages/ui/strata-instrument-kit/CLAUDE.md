# Strata Instrument design system

This project's UI follows **Strata Instrument**: dark by default, keyboard first, measured in mono. The full spec is in `design-system/`.
Read `design-system/README.md` before building or changing any UI.

## Stack
- Web: React + **Base UI** (`@base-ui/react`, headless) styled with **Tailwind CSS v4**.
- Mobile: **React Native + NativeWind**, same tokens and the same props contract.
- Icons: `lucide-react` / `lucide-react-native`, 14px, `strokeWidth={1.5}`. Status and priority are never icons (meter and `P0–P4`).
- Fonts: Geist + Geist Mono (Google Fonts; `@expo-google-fonts/geist` and `/geist-mono` on native).
- Shortcuts: one hotkey layer (e.g. `tinykeys`); mirror every shortcut in `aria-keyshortcuts`.

## Where things are
- `design-system/README.md`: foundations (colour, type, spacing, states, shortcuts, content rules). The source of truth.
- `design-system/tokens.json`: every token, with a usage note. Never hard-code a value that has a token.
- `design-system/components/<Name>.md`: guidelines plus a Base UI + Tailwind recipe per component.
- `design-system/components/index.d.ts`: the props contract. Components must implement these props on web and native.
- `design-system/reference/`: a plain-React reference implementation (`bundle.js`, `bundle.css`, including a natural-language date parser) and live previews (open the `.html` files to compare). Reference only. Don't ship or import it.
- `src/styles/tokens.css`: CSS variables; Graphite on `:root`, Daylight on `[data-theme="light"]`.
- `src/styles/theme.css`: Tailwind v4 `@theme` plus the `screen`, `label-caps`, `kbd`, `dot-grid` and `crop-marks` utilities. Import it once in the app entry.
- `src/theme/tokens.ts`: the same tokens for React Native / NativeWind `vars()`.

## Rules
- Build components in `src/components/ui/<Name>/` (web: `<Name>.tsx`; native: `<Name>.native.tsx`) with one shared `types.ts` re-exporting from `design-system/components/index.d.ts`.
- Style Base UI state attributes (`data-highlighted` → `bg-surface-pressed`, `data-selected`, `data-popup-open`, `data-invalid`, `data-disabled`, `data-pressed`), not React state.
- Use token classes (`bg-surface`, `text-ink-muted`, `border-line-strong`, `rounded-md`, `shadow-popover`). No raw hex values and no `dark:` variants: the app is dark by default and switches via `data-theme` on `<html>`.
- Lime (`accent`) is a fill only. Lime as text, focus rings and thin marks use `accent-ink`, because pure lime is unreadable on white in Daylight.
- Wrap every form control in `Field` (`Field.Root` → `Field.Label` in `label-caps` → control → `Field.Description` / `Field.Error`).
- Every popup ends with a key-legend footer (`↑↓ move · ↵ select · esc`). Selects support `1–9` jump keys.
- Accessibility is required: visible labels, `:focus-visible` outlines in `focus-ring`, status as words (not only meter fill), 44px hit targets on touch, and shortcuts never fire while typing in a field (except Esc and ⌘/Ctrl combos).
