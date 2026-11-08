import '../global.css';

import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/archivo';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const RootLayout = () => {
  // The families @ui/text's Text picks per weight.
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
  });
  if (!fontsLoaded) return null;
  return (
    // Bottom sheets in @sprintstack/ui (react-native-actions-sheet) need the gesture root.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {/* Where @ui/dialog renders. */}
      <PortalHost />
    </GestureHandlerRootView>
  );
};

export default RootLayout;
