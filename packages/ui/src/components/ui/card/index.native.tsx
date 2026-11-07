import { twMerge } from '@lib/tw-merge';
import type { CardProps } from '@ui/types';
import { View } from 'react-native';

const tile = 'min-h-50 gap-4 rounded-2xl p-8';

// Native text doesn't inherit colour, so callers colour their own Text (text-on-brand, text-on-ink).
const variants = {
  panel: 'rounded-xl border border-line bg-surface p-6',
  brand: `${tile} bg-brand`,
  ink: `${tile} bg-ink`,
  muted: `${tile} bg-surface-muted`,
};

const Card = ({ variant = 'panel', className, children }: CardProps) => (
  <View className={twMerge('min-w-0', variants[variant], className)}>{children}</View>
);

export default Card;
