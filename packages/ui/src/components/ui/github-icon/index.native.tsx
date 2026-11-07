import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { GITHUB_MARK } from '@ui/github-icon/path';
import type { IconComponent } from '@ui/types';
import Svg, { Path } from 'react-native-svg';

/**
 * GitHub's mark, shaped like a Lucide icon so it fits `icon={GitHubIcon}` (Lucide ships no brand
 * icons). Native has no colour inheritance: Button passes `color`; on its own it uses ink.
 */
const GitHubIcon: IconComponent = ({ size, color }) => {
  const ink = useTokenColor('ink');
  const px = typeof size === 'number' ? size : scaled(24);
  return (
    <Svg aria-hidden width={px} height={px} viewBox="0 0 24 24">
      <Path d={GITHUB_MARK} fill={color ?? ink} />
    </Svg>
  );
};

export default GitHubIcon;
