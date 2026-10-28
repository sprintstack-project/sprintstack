import '../global.css';
import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { ApiProvider } from '@sprintstack/api-client';
import { DEFAULT_LOCALE, MESSAGES } from '@sprintstack/shared/i18n';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView as BaseGestureHandlerRootView } from 'react-native-gesture-handler';
import { withUniwind } from 'uniwind';
import { IntlProvider } from 'use-intl';
import { apiClient } from '@/lib/api-client';

// Gestures (react-native-sortables, drag handles) only work under this root view.
const GestureHandlerRootView = withUniwind(BaseGestureHandlerRootView);

// Dates and relative times format in the device's zone.
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Keep the native splash (app.json) up until the fonts are in, so there's no blank frame.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // The families @sprintstack/ui's Text picks per weight.
  const [fontsLoaded, fontError] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
  });
  // A font that fails to load falls back to the system font rather than holding the splash.
  const ready = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;
  return (
    <GestureHandlerRootView className="flex-1">
      {/* English only for now, matching the web app (apps/web/src/i18n/request.ts). */}
      <IntlProvider locale={DEFAULT_LOCALE} messages={MESSAGES[DEFAULT_LOCALE]} timeZone={timeZone}>
        <ApiProvider value={apiClient}>
          <Stack screenOptions={{ headerShown: false }} />
        </ApiProvider>
      </IntlProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
