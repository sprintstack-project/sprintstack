/**
 * Native font families by weight (@expo-google-fonts/archivo). React Native can't pick a weight
 * from one custom family, so each weight is its own family; apps load these with useFonts.
 */
export const fonts = {
  400: 'Archivo_400Regular',
  500: 'Archivo_500Medium',
  600: 'Archivo_600SemiBold',
  700: 'Archivo_700Bold',
  800: 'Archivo_800ExtraBold',
} as const;
