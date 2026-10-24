const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// withUniwindConfig must be the outermost wrapper
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
  // Design-system scale: 1rem = 16 × UI_SCALE (packages/ui/src/lib/scale.ts, 0.75). Keep in step.
  polyfills: { rem: 12 },
});
