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
import { apiClient } from '@/lib/api-client';

const RootLayout = () => {
  // The families @sprintstack/ui's Text picks per weight.
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
  });
  if (!fontsLoaded) return null;
  return (
    <ApiProvider value={apiClient}>
      {/* Sign-in and sign-up screens draw their own header. */}
      <Stack screenOptions={({ route }) => ({ headerShown: route.name === 'index' })} />
    </ApiProvider>
  );
};

export default RootLayout;
