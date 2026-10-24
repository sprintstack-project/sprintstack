# SprintStack Bold design system

This project's UI follows the **SprintStack Bold** design system. The full spec is in `design-system/`.
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
- Import inside the package with aliases, never relative paths: `@ui/*` → `src/components/ui/*`, `@lib/*` → `src/lib/*`. Apps compile this source, so a new alias must be added to `packages/ui/tsconfig.web.json` and `tsconfig.native.json`, the `paths` of `apps/web`, `apps/mobile`, `apps/storybook/tsconfig.app.json` and `packages/forms/tsconfig.json`, and `resolve.alias` in `apps/storybook/vite.config.ts`.
- Build components in `src/components/ui/<Name>/` (web: `<Name>.tsx`; native: `<Name>.native.tsx`) with one shared `types.ts` re-exporting from `design-system/components/index.d.ts`.
- `types.ts` overrides the contract where we deliberately differ: icons are components imported from `lucide-react` / `lucide-react-native` (`icon={Plus}`), never name strings; `Input` takes `slots={{ left, right }}` (any node: icon, unit, or a labelled action button) in place of `leadingIcon` / `trailing`.
- Native components (`<Name>.native.tsx`) share helpers in `src/lib/`: `fieldShell()` (the 56px field outline; pass focus state yourself), `tintSlot()`, `useTokenColor()` (raw colours for Lucide's `color` prop: native has no colour inheritance), and `Sheet` (react-native-actions-sheet, used by Select, MultiSelect and DatePicker). Type-check native with `tsconfig.native.json` (`yarn workspace @sprintstack/ui typecheck` runs both). `tsconfig.json` is only a solution file referencing the two, so editors give `*.native.tsx` the Uniwind `className` types.
- On native, import `Text` from `@ui/Text` (apps: `@sprintstack/ui`), never from `react-native`. RN can't apply a custom font's weights, so it reads the weight from the classes and sets the matching Archivo family (`src/lib/fonts.ts`); apps load those families with `useFonts` from `@expo-google-fonts/archivo`.
- Native text never inherits colour: put the text colour class on the `<Text>`, not its parent. Write class names out in full (no `` `text-${tone}` ``): Tailwind and Uniwind only generate classes they can find verbatim. Shared class maps live in `src/lib/*.ts`, which both apps scan.
- `Field` exposes its label and hint ids through `useField()` (web and native). Base UI controls link up automatically; anything else (DatePicker's trigger, native controls) must label itself from it.
- Popups portal to `<body>`. Wrap a subtree that has its own `data-theme` (or sits in a dialog/shadow root) in `PortalContainerProvider` so its menus take that theme.
- Every form control takes `onBlur` (popups blur when they close) and plain `value`/`onChange`. Never import a form library here: forms live in `packages/forms` (TanStack Form `useAppForm` + field bindings) and schemas in `packages/shared` (Zod), shared with the API.
- `RichTextEditor` stores Tiptap JSON on both platforms (Tiptap on web, 10tap-editor's WebView on native). It keeps its own state while typing; a `value` that differs from the last one it reported replaces the content, so `form.reset(loaded)` works without remounts or `key`s. `richTextToPlainText` / `isRichTextEmpty` cover search and required checks.
- Stories: web in `apps/storybook/src/stories` (with play-function tests), native in `apps/storybook/native-stories` (on-device Storybook, `yarn workspace storybook storybook:native`). Add both when a component changes.
- Long option lists: `Select searchable` (Base UI Combobox + search) and `MultiSelect` virtualize their rows with TanStack Virtual (`Select/VirtualOptionList.tsx`; Combobox `virtualized` + item `index`). Plain `Select` stays on Base UI Select for short fixed lists; it can't be virtualized safely. Native sheets use actions-sheet's `FlatList`.
- Web components that use hooks or context start with `'use client'`, so apps can import `@sprintstack/ui` from Server Components (the barrel loads every component).
- Links or submit buttons that should look like a Button use `buttonClass(variant, size)` (`<a className={buttonClass('primary', 'sm')}>`). Hover states use `not-disabled:`, not `enabled:`, so they work on `<a>` too.
- Style Base UI state attributes (`data-highlighted`, `data-selected`, `data-popup-open`, `data-invalid`, `data-disabled`, `data-pressed`), not React state.
- Use token classes (`bg-surface`, `text-ink-muted`, `border-line-strong`, `rounded-xl`, `shadow-popover`). The default Tailwind palette is removed (`--color-*: initial`). No raw hex values, no `dark:` variants: themes switch via `data-theme` on `<html>` (web) or `Uniwind.setTheme` (native).
- Wrap every form control in `Field` (`Field.Root` → `Field.Label` → control → `Field.Description` / `Field.Error`).
- Size: the system renders at 75% of the spec's sizes. One knob per platform: `--ui-scale` in `src/styles/tokens.web.css` (root font-size) and `UI_SCALE` in `src/lib/scale.ts` (with Uniwind's `polyfills.rem` in `apps/mobile/metro.config.js`). Write lengths in rem or Tailwind spacing, never px (except 1–2px hairlines); native numeric props go through `scaled()`.
- Accessibility is required: visible labels, `:focus-visible` outlines in `focus-ring`, status as words (not colour). Native touch targets stay 44pt+ (`touchSlop()` adds hitSlop as controls shrink); web targets meet WCAG 2.2 AA (24px+).
- Only headlines and badges are uppercase. All other copy is sentence case.
