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
  extra: {
    eas: {
      projectId: 'b32be819-55db-4421-994f-8291db7fb472',
    },
  },
  ios: {
    icon: './assets/images/icon.png',
    bundleIdentifier: 'com.sprintstack.app',
    supportsTablet: true,
    // TODO: re-enable once on a paid Apple Developer account (free accounts can't sign Associated Domains)
    associatedDomains: ['webcredentials:sprintstack.io'],
    // Pushes (src/lib/push.ts): Firebase console → Project settings → Your apps → the iOS app.
    googleServicesFile: './firebase/dev/GoogleService-Info.plist',
    // TODO: re-enable once on a paid Apple Developer account (free accounts can't sign Push
    // Notifications). Until then iOS gets no pushes; the bell refreshes when the app opens.
    entitlements: { 'aps-environment': 'production' },
    infoPlist: { UIBackgroundModes: ['remote-notification'], ITSAppUsesNonExemptEncryption: false },
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
    // Pushes: Firebase console → Project settings → Your apps → the Android app.
    googleServicesFile: './firebase/dev/google-services.json',
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
    // Zero-tap sign-in restoration on Android (src/lib/restore-key.ts). The backup agent notices a
    // data restore after first launch, so the app tries its restore key again.
    ['expo-restore-credentials', { backupAgent: true }],
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
    // Only for push permission (src/lib/push.ts); Firebase delivers the pushes.
    'expo-notifications',
    '@react-native-firebase/app',
    // Devices are known to the API by Firebase Installation ID, not FCM token.
    ['@react-native-firebase/messaging', { installationIdEnabled: true }],
    // Crash reports alongside the app's other Firebase data (src/lib/monitoring.ts).
    '@react-native-firebase/crashlytics',
    // Firebase's Apple SDK ships as dynamic frameworks only.
    ['expo-build-properties', { ios: { useFrameworks: 'dynamic' } }],
    // Uploads source maps and native debug symbols to Sentry during native builds, so its stack
    // traces show the original code. Needs SENTRY_AUTH_TOKEN in the build environment.
    [
      '@sentry/react-native/expo',
      { url: 'https://sentry.io/', organization: 'sprintstack', project: 'sprintstack-mobile' },
    ],
    'expo-font',
    'expo-image',
    'expo-web-browser',
    // Choosing a profile photo; the camera isn't used.
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow SprintStack to use a photo for your profile.',
        cameraPermission: false,
        microphonePermission: false,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
