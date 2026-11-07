import { useSidebar } from '@ui/sidebar';
import Text from '@ui/text';
import type { SectionProps } from '@ui/types';
import { View } from 'react-native';

const Section = ({ title, description, phoneDescription, children }: SectionProps) => {
  const { drawer } = useSidebar();
  if (drawer) {
    return (
      <>
        {phoneDescription && (
          <Text className="text-[1.0625rem] leading-6 text-ink-muted">{description}</Text>
        )}
        {children}
      </>
    );
  }
  return (
    <View className="gap-6 rounded-3xl border border-line bg-surface p-8">
      <View className="gap-2">
        <Text accessibilityRole="header" className="text-headline uppercase text-ink">
          {title}
        </Text>
        <Text className="text-[1.0625rem] leading-6 text-ink-muted">{description}</Text>
      </View>
      {children}
    </View>
  );
};

export default Section;
