import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'SprintStack',
  slug: 'sprintstack',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'sprintstack',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/images/icon.png',
    bundleIdentifier: 'com.sprintstack.app',
    // TODO: re-enable once on a paid Apple Developer account (free accounts can't sign Associated Domains)
    // associatedDomains: ['webcredentials:sprintstack.io'],
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#0a0c0b',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.sprintstack.app',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon-light.png',
        imageWidth: 160,
        resizeMode: 'contain',
        backgroundColor: '#f3f4f2',
        dark: {
          image: './assets/images/splash-icon.png',
          backgroundColor: '#0a0c0b',
        },
      },
    ],
    'expo-secure-store',
    [
      './plugins/withAndroidSigning',
      {
        debug: {
          storeFile: './keystores/android-keystore-debug.jks',
          storePassword: 'android',
          keyAlias: 'app20-dev',
          keyPassword: 'android',
        },
        // release key comes from ANDROID_RELEASE_* env vars (see plugin)
        useReleaseSigning: process.env.EXPO_PUBLIC_APP_ENV === 'prd',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
