// Native Storybook (on-device), alongside the web Storybook in .storybook/.
const { getDefaultConfig } = require('expo/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// liteMode drops the default on-device UI (built on @gorhom/bottom-sheet); .rnstorybook/index.ts
// uses LiteUI instead, which also works in Expo Go. The two must change together.
const storybookConfig = withStorybook(config, { configPath: './.rnstorybook', liteMode: true });

// withUniwindConfig must be the outermost wrapper.
module.exports = withUniwindConfig(storybookConfig, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
  // Design-system scale: 1rem = 16 × UI_SCALE (packages/ui/src/lib/scale.ts, 0.75). Keep in step.
  polyfills: { rem: 12 },
});
