import { Text } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { itemHref, type WorkItem } from './data';
import { ItemCard } from './item-card';

export const Empty = ({ children }: { children: string }) => (
  <View className="rounded-xl border border-dashed border-line-strong p-6">
    <Text className="text-center text-meta font-semibold text-ink-muted">{children}</Text>
  </View>
);

export const openItem = (item: WorkItem) => router.navigate(itemHref(item.key) as Href);

export const ListView = ({ items }: { items: WorkItem[] }) => {
  if (items.length === 0) return <Empty>No work items match these filters.</Empty>;
  return (
    <View className="overflow-hidden rounded-xl border border-line bg-surface">
      {items.map((item, i) => (
        <Pressable
          key={item.key}
          accessibilityRole="link"
          onPress={() => openItem(item)}
          className={`p-5 active:bg-surface-pressed ${i > 0 ? 'border-t border-line' : ''}`}
        >
          <ItemCard item={item} />
        </Pressable>
      ))}
    </View>
  );
};
