import { scaled } from '@lib/scale';
import { type SidebarItem, Text } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { MORE_SECTIONS } from '@/components/main/navigation';
import { useTokenColor } from '@/lib/use-token-color';

const Row = ({ item, first }: { item: SidebarItem; first: boolean }) => {
  const ink = useTokenColor('ink');
  const muted = useTokenColor('ink-muted');
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={item.label}
      onPress={() => item.href && router.navigate(item.href as Href)}
      className={`min-h-16 flex-row items-center gap-4 px-5 active:bg-surface-pressed ${first ? '' : 'border-t border-line'}`}
    >
      {Icon && <Icon aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />}
      <Text className="flex-1 text-[1.0625rem] leading-6 font-bold text-ink">{item.label}</Text>
      <ChevronRight aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
    </Pressable>
  );
};

/** The sidebar's items that have no tab on phones, grouped as in the sidebar. */
export const More = () => (
  <View className="gap-6">
    {MORE_SECTIONS.map((section) => (
      <View key={section.title ?? 'main'} className="gap-3">
        {section.title && (
          <Text
            accessibilityRole="header"
            className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted"
          >
            {section.title}
          </Text>
        )}
        <View className="overflow-hidden rounded-2xl border border-line bg-surface">
          {section.items.map((item, i) => (
            <Row key={item.key} item={item} first={i === 0} />
          ))}
        </View>
      </View>
    ))}
  </View>
);
