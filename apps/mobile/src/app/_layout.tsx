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
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

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
    <ApiProvider value={apiClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </ApiProvider>
  );
};

export default RootLayout;
