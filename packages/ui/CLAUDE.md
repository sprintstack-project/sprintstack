# Strata Bold design system

This project's UI follows the **Strata Bold** design system. The full spec is in `design-system/`.
Read `design-system/README.md` before building or changing any UI.

## Stack
- Web: React + **Base UI** (`@base-ui/react`, headless) styled with **Tailwind CSS v4**.
- Mobile: **React Native + Uniwind** (Tailwind v4 for RN), same tokens and the same props contract.
- Icons: `lucide-react` / `lucide-react-native`, 24px, `strokeWidth={2}`.
- Font: Archivo (Google Fonts, variable width). Condensed styles use `font-stretch: 75%`.

## Where things are
- `design-system/README.md`: foundations (colour, type, spacing, states, content rules). The source of truth.
- `design-system/tokens.json`: every token, with a usage note. Never hard-code a value that has a token.
- `design-system/components/<Name>.md`: guidelines plus a Base UI + Tailwind recipe per component.
- `design-system/components/index.d.ts`: the props contract. Components must implement these props on web and native.
- `design-system/reference/`: a plain-React reference implementation (`bundle.js`, `bundle.css`) and live previews (open the `.html` files to compare). Reference only. Don't ship or import it.
- `src/styles/`: the Tailwind v4 token system. Two themes only: `light` (Day) and `dark` (Night).
  - `theme.css`: shared `@theme` (colour and shadow names, radii, type scale). Every colour is `--color-<name>: var(--color-<name>)`; values come from the platform file.
  - `tokens.web.css`: web values under `@layer base`, keyed by `[data-theme="light" | "dark"]` with a `prefers-color-scheme` fallback; Archivo via `--font-archivo` (next/font) or the Google Fonts family.
  - `tokens.native.css`: Uniwind values in `@layer theme { :root { @variant light {…} @variant dark {…} } }`. Both variants must define the same variables.
  - `utilities.css`: web-only `field`, `headline`, `eyebrow`, `link`, `kbd-focus` utilities.
  - Entry points: web apps `@import "tailwindcss"` then `@sprintstack/ui/styles/web.css`; mobile `@import "tailwindcss"`, `"uniwind"`, then `@sprintstack/ui/styles/native.css`.
  - When a token changes in `tokens.json`, update both `tokens.web.css` and `tokens.native.css`.
- `src/theme/tokens.ts`: the same values for JS (e.g. icon `color` props on native).

## Rules
- Build components in `src/components/ui/<Name>/` (web: `<Name>.tsx`; native: `<Name>.native.tsx`) with one shared `types.ts` re-exporting from `design-system/components/index.d.ts`.
- Style Base UI state attributes (`data-highlighted`, `data-selected`, `data-popup-open`, `data-invalid`, `data-disabled`, `data-pressed`), not React state.
- Use token classes (`bg-surface`, `text-ink-muted`, `border-line-strong`, `rounded-xl`, `shadow-popover`). The default Tailwind palette is removed (`--color-*: initial`). No raw hex values, no `dark:` variants: themes switch via `data-theme` on `<html>` (web) or `Uniwind.setTheme` (native).
- Wrap every form control in `Field` (`Field.Root` → `Field.Label` → control → `Field.Description` / `Field.Error`).
- Accessibility is required: visible labels, `:focus-visible` outlines in `focus-ring`, status as words (not colour), 44px+ hit targets.
- Only headlines and badges are uppercase. All other copy is sentence case.
