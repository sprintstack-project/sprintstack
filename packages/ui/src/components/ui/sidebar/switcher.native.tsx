import { isImageUrl } from '@lib/status';
import Select from '@ui/select/select';
import { Text } from '@ui/text';
import type { SidebarSwitcher } from '@ui/types';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';

// Shared by the sidebar and, on phones (no sidebar), the header.

/** The brand tile behind the project key and the person's initials. */
export const tile = 'size-11 shrink-0 items-center justify-center bg-brand';
export const tileText = 'text-[0.9375rem] leading-4 font-extrabold uppercase text-on-brand';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

/** The person's photo, or their initials on the brand tile. `className` sizes it. */
export const Avatar = ({
  name,
  avatar,
  className = 'size-11',
}: {
  name: string;
  avatar?: string;
  className?: string;
}) => {
  if (avatar && isImageUrl(avatar)) {
    return (
      <Image
        source={{ uri: avatar }}
        accessibilityIgnoresInvertColors
        className={clsx(className, 'rounded-full')}
      />
    );
  }
  return (
    <View className={clsx(tile, className, 'rounded-full')}>
      <Text className={tileText}>{avatar ?? initialsOf(name)}</Text>
    </View>
  );
};

/** A project or account row: a combobox (bottom sheet) when given options, else a button. */
export const Switcher = ({
  switcher,
  label,
  className,
  hitSlop,
  children,
}: {
  switcher: SidebarSwitcher;
  label: string;
  className: string;
  hitSlop?: number;
  children: ReactNode;
}) => {
  if (!switcher.options) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={switcher.onPress}
        hitSlop={hitSlop}
        className={className}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <Select
      options={switcher.options}
      value={switcher.value}
      onValueChange={switcher.onValueChange}
      searchable={switcher.searchable ?? true}
      trigger={{ label, className, hitSlop, children }}
    />
  );
};
