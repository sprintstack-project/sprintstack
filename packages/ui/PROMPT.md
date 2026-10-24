# Kickoff prompt for Claude Code

Paste this into Claude Code from your project root after copying this kit in:

---

Read CLAUDE.md and design-system/README.md. Then:

1. Install the dependencies we need: @base-ui/react, rn-primitives, lucide-react, tailwindcss@4 and @tailwindcss/vite (or @tailwindcss/postcss, whichever matches our bundler). Import src/styles/theme.css in the app entry.
2. Build the 10 components in design-system/components/ (Card, Field, Input, TextArea, NumberInput, Select, MultiSelect, Chip, DatePicker, Button) under src/components/ui/, one at a time, in that order: Button, Field, Input, TextArea, NumberInput, Select, MultiSelect, Chip, DatePicker, Card. Implement exactly the props in design-system/components/index.d.ts, follow each component's .md recipe, and use Base UI primitives (DatePicker = Base UI Popover + react-day-picker).
3. For each component, add a Storybook story (or a /dev/ui route if we have no Storybook) showing the same states as design-system/reference/previews/<Name>.html in both themes, plus a test for keyboard behaviour and labels.
4. Stop after Button and Field and show me before continuing.

---

React Native: run the same prompt with "build the .native.tsx versions with NativeWind, using src/theme/tokens.ts" in step 2.
