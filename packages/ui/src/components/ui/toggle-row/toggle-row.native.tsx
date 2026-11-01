import Switch from '@ui/switch/switch';
import { Text } from '@ui/text';
import type { ToggleRowProps } from '@ui/types';
import { View } from 'react-native';

const ToggleRow = ({ title, description, checked, onCheckedChange, children }: ToggleRowProps) => (
  <View className="gap-3 border-t border-line py-5">
    <View className="flex-row items-start gap-4">
      <View className="flex-1 gap-1">
        <Text className="text-[1.0625rem] leading-6 font-bold text-ink">{title}</Text>
        <Text className="text-[0.9375rem] leading-5 text-ink-muted">{description}</Text>
      </View>
      <Switch label={title} checked={checked} onCheckedChange={onCheckedChange} />
    </View>
    {children}
  </View>
);

export default ToggleRow;
