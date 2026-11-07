import type { ButtonGroupProps } from '@ui/types';
import { View } from 'react-native';

const ButtonGroup = ({ children }: ButtonGroupProps) => (
  <View className="flex-row flex-wrap items-center gap-3">{children}</View>
);

export default ButtonGroup;
