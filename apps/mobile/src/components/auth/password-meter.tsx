import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_STRENGTH_LABEL,
  passwordStrength,
} from '@sprintstack/shared';
import { Text } from '@sprintstack/ui';
import { View } from 'react-native';

/** Four bars and a line of words (status as words, not colour). The API checks leaked passwords. */
export const PasswordMeter = ({ password }: { password: string }) => {
  const strength = passwordStrength(password);
  const longEnough = password.length >= PASSWORD_MIN_LENGTH;
  const summary = password
    ? `${PASSWORD_STRENGTH_LABEL[strength]} · ${PASSWORD_MIN_LENGTH}+ chars ${longEnough ? 'met' : 'needed'}`
    : `Use at least ${PASSWORD_MIN_LENGTH} characters`;
  return (
    <View className="gap-2" accessibilityLiveRegion="polite">
      <View className="flex-row gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            className={
              bar <= strength
                ? 'h-1.5 flex-1 rounded-full bg-brand-ink'
                : 'h-1.5 flex-1 rounded-full bg-line'
            }
          />
        ))}
      </View>
      <Text className="text-[0.875rem] leading-4 font-extrabold uppercase text-ink">{summary}</Text>
    </View>
  );
};
