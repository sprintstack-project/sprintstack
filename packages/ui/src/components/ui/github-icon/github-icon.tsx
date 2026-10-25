import { GITHUB_MARK } from '@ui/github-icon/path';
import type { IconComponent } from '@ui/types';

/**
 * GitHub's mark, shaped like a Lucide icon so it fits `icon={GitHubIcon}` (Lucide ships no brand
 * icons). Filled, in the text colour; `strokeWidth` is accepted and ignored.
 */
const GitHubIcon: IconComponent = ({ size, color = 'currentColor', className }) => (
  <svg
    width={size ?? 24}
    height={size ?? 24}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    // Always beside a text label (e.g. "Continue with GitHub"), so it's decorative.
    aria-hidden
  >
    <path d={GITHUB_MARK} />
  </svg>
);

export default GitHubIcon;
