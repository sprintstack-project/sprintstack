const path = require('node:path');
const fs = require('node:fs');
const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Injects real debug + release signingConfigs into android/app/build.gradle.
 *
 * Expo prebuild regenerates android/ from the RN template, which hardcodes
 * `release { signingConfig signingConfigs.debug }`. That produces a
 * debug-signed AAB the Play Store rejects. This plugin runs on every prebuild
 * and rewrites the signingConfigs block + points the release buildType at the
 * release key.
 *
 * Props shape (from brand.config.ts android.signingConfig + a flag):
 *   { debug:   { storeFile, storePassword, keyAlias, keyPassword },
 *     release: { storeFile, storePassword, keyAlias, keyPassword },
 *     useReleaseSigning: boolean }
 *
 * The release key is wired in ONLY when useReleaseSigning is true
 * (EXPO_PUBLIC_APP_ENV === 'prd'). For non-prod the release buildType keeps
 * the debug key and release secrets are never written into build.gradle.
 *
 * CI / secret override — release values fall back to env vars so the
 * committed brand.config values are not the source of truth in pipelines:
 *   ANDROID_RELEASE_STORE_FILE, ANDROID_RELEASE_STORE_PASSWORD,
 *   ANDROID_RELEASE_KEY_ALIAS,  ANDROID_RELEASE_KEY_PASSWORD
 */
module.exports = function withAndroidSigning(config, props) {
  const { debug, useReleaseSigning } = props || {};

  if (!debug) {
    throw new Error('withAndroidSigning: expected a "debug" signing config');
  }

  // env vars win over committed brand.config values (used in CI)
  const resolvedRelease = useReleaseSigning
    ? {
        storeFile: process.env.ANDROID_RELEASE_STORE_FILE,
        storePassword: process.env.ANDROID_RELEASE_STORE_PASSWORD,
        keyAlias: process.env.ANDROID_RELEASE_KEY_ALIAS,
        keyPassword: process.env.ANDROID_RELEASE_KEY_PASSWORD,
      }
    : null;

  const required = ['storeFile', 'storePassword', 'keyAlias', 'keyPassword'];
  const configsToCheck = resolvedRelease ? [debug, resolvedRelease] : [debug];
  for (const cfg of configsToCheck) {
    for (const key of required) {
      if (!cfg[key]) {
        throw new Error(
          `withAndroidSigning: missing "${key}" in signing config`,
        );
      }
    }
  }

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error(
        'withAndroidSigning: can only patch groovy build.gradle files',
      );
    }

    const projectRoot = config.modRequest.projectRoot;

    // storeFile in build.gradle resolves relative to android/app — use an
    // absolute, forward-slash path so it works on any OS / CI checkout dir.
    const toGradlePath = (p, label) => {
      const abs = path.isAbsolute(p) ? p : path.resolve(projectRoot, p);
      if (!fs.existsSync(abs)) {
        // warn, don't fail — gradle will surface a clearer error at build time
        console.warn(
          `withAndroidSigning: ${label} keystore not found at ${abs}`,
        );
      }
      return abs.replace(/\\/g, '/');
    };

    const debugStore = toGradlePath(debug.storeFile, 'debug');

    let contents = config.modResults.contents;

    // 1. Replace the whole signingConfigs { ... } block. The release block is
    //    only emitted for prod — non-prod build.gradle never carries release
    //    secrets. Non-greedy up to the first 4-space-indented closing brace,
    //    which is the signingConfigs block close in the RN template.
    const releaseBlock = resolvedRelease
      ? `
        release {
            storeFile file('${toGradlePath(resolvedRelease.storeFile, 'release')}')
            storePassword '${resolvedRelease.storePassword}'
            keyAlias '${resolvedRelease.keyAlias}'
            keyPassword '${resolvedRelease.keyPassword}'
        }`
      : '';

    const signingConfigsBlock = `signingConfigs {
        debug {
            storeFile file('${debugStore}')
            storePassword '${debug.storePassword}'
            keyAlias '${debug.keyAlias}'
            keyPassword '${debug.keyPassword}'
        }${releaseBlock}
    }`;

    if (!/signingConfigs\s*\{[\s\S]*?\n {4}\}/.test(contents)) {
      throw new Error(
        'withAndroidSigning: could not locate signingConfigs block in build.gradle',
      );
    }
    contents = contents.replace(
      /signingConfigs\s*\{[\s\S]*?\n {4}\}/,
      signingConfigsBlock,
    );

    // 2. Normalize the release buildType's signingConfig. Prod -> release key,
    //    non-prod -> debug key. Matches either current value so it is
    //    self-correcting across prebuilds without --clean (where a prior prod
    //    run may have left `signingConfigs.release` behind). Anchor on
    //    `release {` so the debug buildType's line (earlier in the file) is
    //    left untouched.
    const releaseTarget = resolvedRelease ? 'release' : 'debug';
    contents = contents.replace(
      /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+)signingConfigs\.(?:debug|release)/,
      `$1signingConfigs.${releaseTarget}`,
    );

    config.modResults.contents = contents;
    return config;
  });
};
