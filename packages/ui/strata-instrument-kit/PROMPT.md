# Kickoff prompt for Claude Code

Paste this into Claude Code from your project root after copying this kit in:

---

Read CLAUDE.md and design-system/README.md. Then:

1. Install the dependencies we need: @base-ui/react, lucide-react, react-day-picker, tinykeys, tailwindcss@4 and @tailwindcss/vite (or @tailwindcss/postcss, whichever matches our bundler). Import src/styles/theme.css in the app entry, and add the no-flash theme script from design-system/README.md ("Theme switching") to index.html, defaulting to dark.
2. Build the 10 components in design-system/components/ under src/components/ui/, one at a time, in this order: Button (with shortcut hints), Field, Input, TextArea, NumberInput, Select, MultiSelect, Chip (status meter, P0–P4 priority, tokens, segmented filters), DatePicker, Card. Implement exactly the props in design-system/components/index.d.ts, follow each component's .md recipe, and use Base UI primitives (DatePicker = Base UI Popover + react-day-picker + the date parser; port parseDate from design-system/reference/bundle.js or use chrono-node).
3. Add a shared Kbd component and a useShortcut hook (tinykeys) that sets aria-keyshortcuts and ignores keys while typing in inputs.
4. For each component, add a Storybook story (or a /dev/ui route if we have no Storybook) showing the same states as design-system/reference/previews/<Name>.html in both Graphite and Daylight, plus tests for keyboard behaviour and labels.
5. Stop after Button and Field and show me before continuing.

---

React Native: run the same prompt with "build the .native.tsx versions with NativeWind, using src/theme/tokens.ts; hide kbd hints unless a hardware keyboard is attached" in step 2.
