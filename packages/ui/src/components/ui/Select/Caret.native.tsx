import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import Svg, { Path } from 'react-native-svg';

/** The solid ▾ caret for selects. Rotates while the sheet is open. */
export function Caret({ open, disabled }: { open?: boolean; disabled?: boolean }) {
  const color = useTokenColor(disabled ? 'ink-disabled' : 'ink');
  return (
    <Svg
      aria-hidden
      width={scaled(10)}
      height={scaled(6)}
      viewBox="0 0 10 6"
      style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
    >
      <Path d="M0 0h10L5 6z" fill={color} />
    </Svg>
  );
}
