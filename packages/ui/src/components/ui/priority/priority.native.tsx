import { scaled } from '@lib/scale';
import { PRIORITY_DIRECTION, PRIORITY_LABEL } from '@lib/status';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { PriorityProps } from '@ui/types';
import { ArrowDown, ArrowUp, Equal } from 'lucide-react-native';
import { View } from 'react-native';

const icons = { up: ArrowUp, flat: Equal, down: ArrowDown };

const Priority = ({ level }: PriorityProps) => {
  const direction = PRIORITY_DIRECTION[level];
  const Icon = icons[direction];
  const color = useTokenColor(direction === 'up' ? 'brand-ink' : 'ink');
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon aria-hidden size={scaled(18)} strokeWidth={2} color={color} />
      <Text className="text-[0.9375rem] leading-5 font-bold text-ink-muted">
        {PRIORITY_LABEL[level]}
      </Text>
    </View>
  );
};

export default Priority;
