import { STATUS_CLASSES, STATUS_LABEL } from '@lib/status';
import { Text } from '@ui/text';
import type { BadgeProps } from '@ui/types';
import { clsx } from 'clsx';
import { View } from 'react-native';

const Badge = ({ tone, children }: BadgeProps) => {
  return (
    <View
      className={clsx(
        'h-7 flex-row items-center self-start rounded-full px-3',
        STATUS_CLASSES[tone].box,
      )}
    >
      <Text
        numberOfLines={1}
        className={clsx(
          'text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.4px]',
          STATUS_CLASSES[tone].text,
        )}
      >
        {children ?? STATUS_LABEL[tone]}
      </Text>
    </View>
  );
};

export default Badge;
