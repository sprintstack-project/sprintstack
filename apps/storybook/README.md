# Storybook

Two Storybooks for `@sprintstack/ui` and `@sprintstack/forms`, in one app.

| | Web | Native (on device) |
|---|---|---|
| Run | `yarn storybook` → http://localhost:6006 | `yarn storybook:native` (or `storybook:native:ios`), open in Expo Go |
| Config | `.storybook/` (React + Vite) | `.rnstorybook/` (React Native, LiteUI) + `metro.config.js` |
| Stories | `src/stories/**` | `native-stories/**` |
| Renders | the DOM components (`<Name>.tsx`) | the native components (`<Name>.native.tsx`) |
| Tests | `yarn test` (Vitest + Playwright, play functions) | none yet |

Web and native stories are separate because layout (`div` vs `View`) and test queries differ.
Add a story to both when you add or change a component.

After adding or renaming native story files, run `yarn storybook:native:stories` to regenerate
`.rnstorybook/storybook.requires.ts` (Metro also does this on start).
