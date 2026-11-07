import Text from '@ui/text';
import type { EyebrowProps } from '@ui/types';

const Eyebrow = ({ children, heading }: EyebrowProps) => (
  <Text
    accessibilityRole={heading ? 'header' : undefined}
    className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted"
  >
    {children}
  </Text>
);

export default Eyebrow;
