import { scaled, touchSlop } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { isImageUrl } from '@lib/status';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { HeaderNotification, HeaderNotifications } from '@ui/types';
import { clsx } from 'clsx';
import { Bell, BellOff } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { FlatList } from 'react-native-actions-sheet';

/** The bell and its sheet (native's dropdown, as for Select). */
const Notifications = ({
  items,
  onSelect,
  onMarkAllRead,
  onViewAll,
  unread: unreadProp,
  buttonClassName,
}: HeaderNotifications & { buttonClassName: string }) => {
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const ink = useTokenColor('ink');
  const muted = useTokenColor('ink-muted');
  const unread = unreadProp ?? items.filter((item) => item.unread).length;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setOpen(true);
          sheet.current?.show();
        }}
        hitSlop={touchSlop(40)}
        className={buttonClassName}
      >
        <Bell aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
        {unread > 0 && (
          <View className="absolute top-1.5 right-2 size-2.5 rounded-full border-2 border-canvas bg-brand-ink" />
        )}
      </Pressable>

      <Sheet sheetRef={sheet} onClose={() => setOpen(false)}>
        <View className="flex-row items-center gap-3 px-4 pb-2">
          <Text
            accessibilityRole="header"
            className="flex-1 text-[1.125rem] leading-6 font-bold text-ink"
          >
            Notifications
          </Text>
          {onMarkAllRead && unread > 0 && (
            <Pressable
              accessibilityRole="button"
              onPress={onMarkAllRead}
              hitSlop={touchSlop(24)}
              className="active:opacity-70"
            >
              <Text className="text-meta font-bold text-brand-ink">Mark all as read</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: scaled(560) }}
          ListEmptyComponent={
            <View className="items-center gap-2 px-6 py-10">
              <BellOff aria-hidden size={scaled(24)} strokeWidth={2} color={muted} />
              <Text className="font-semibold text-ink-muted">You're all caught up</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Row
              item={item}
              first={index === 0}
              onPress={() => {
                sheet.current?.hide();
                onSelect?.(item);
              }}
            />
          )}
        />

        {onViewAll && (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              sheet.current?.hide();
              onViewAll();
            }}
            className="min-h-11 justify-center border-t border-line px-4 active:opacity-70"
          >
            <Text className="text-meta font-bold text-brand-ink">View all notifications</Text>
          </Pressable>
        )}
      </Sheet>
    </>
  );
};

const Row = ({
  item,
  first,
  onPress,
}: {
  item: HeaderNotification;
  first: boolean;
  onPress: () => void;
}) => {
  const ink = useTokenColor('ink');
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[item.unread && 'Unread', item.title, item.description, item.time]
        .filter(Boolean)
        .join(', ')}
      onPress={onPress}
      className={clsx(
        'flex-row items-start gap-3 rounded-md px-3 py-3 active:bg-surface-pressed',
        !first && 'border-t border-line',
      )}
    >
      {item.avatar && isImageUrl(item.avatar) ? (
        <Image
          source={{ uri: item.avatar }}
          accessibilityIgnoresInvertColors
          className="size-10 rounded-full"
        />
      ) : (
        <View className="size-10 items-center justify-center rounded-full bg-surface-muted">
          {Icon ? (
            <Icon aria-hidden size={scaled(20)} strokeWidth={2} color={ink} />
          ) : (
            <Text className="text-meta font-bold text-ink">{item.avatar}</Text>
          )}
        </View>
      )}
      <View className="min-w-0 flex-1">
        <Text className={clsx('text-body', item.unread ? 'font-bold text-ink' : 'text-ink-muted')}>
          {item.title}
        </Text>
        {item.description && (
          <Text numberOfLines={1} className="text-meta font-semibold text-ink-muted">
            {item.description}
          </Text>
        )}
        <Text className="text-meta font-semibold text-ink-muted">{item.time}</Text>
      </View>
      {item.unread && <View className="mt-2 size-2.5 rounded-full bg-brand-ink" />}
    </Pressable>
  );
};

export default Notifications;
