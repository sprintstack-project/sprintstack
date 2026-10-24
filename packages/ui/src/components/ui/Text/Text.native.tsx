import { fonts } from '@lib/fonts';
import { Text as RNText, StyleSheet, type TextProps } from 'react-native';
import { useResolveClassNames } from 'uniwind';

type Weight = keyof typeof fonts;
const WEIGHTS = Object.keys(fonts).map(Number) as Weight[];

/** The loaded weight closest to `fontWeight` ('bold', '800', 600, …). */
function familyFor(fontWeight: unknown) {
  const w = fontWeight === 'bold' ? 700 : Number(fontWeight) || 400;
  const nearest = WEIGHTS.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
  return fonts[nearest];
}

/**
 * React Native's Text with the Archivo family set. RN can't apply a custom font's weights from
 * fontWeight, so this reads the weight from the classes and style and picks that weight's family.
 * Use it in place of react-native's Text everywhere.
 */
const Text = ({ className, style, ...rest }: TextProps) => {
  const resolved = useResolveClassNames(className ?? '');
  const { fontWeight } = StyleSheet.flatten([resolved, style]) ?? {};
  return (
    <RNText
      {...rest}
      className={className}
      // fontWeight goes back to normal: on Android a weight on a custom family falls back to the system font.
      style={[style, { fontFamily: familyFor(fontWeight), fontWeight: 'normal' }]}
    />
  );
};

export default Text;
