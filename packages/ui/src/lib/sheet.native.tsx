import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { ReactNode, RefObject } from 'react';
import { View } from 'react-native';
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet';

export type SheetRef = ActionSheetRef;

interface SheetProps {
  sheetRef: RefObject<SheetRef | null>;
  /** Shown at the top, usually the field's label. */
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

/** The bottom sheet behind native Select, MultiSelect and DatePicker, themed from the tokens. */
export function Sheet({ sheetRef, title, onClose, children }: SheetProps) {
  const surface = useTokenColor('surface');
  const line = useTokenColor('line-strong');
  const scrim = useTokenColor('scrim');
  return (
    <ActionSheet
      ref={sheetRef}
      gestureEnabled
      useBottomSafeAreaPadding
      onClose={onClose}
      overlayColor={scrim}
      defaultOverlayOpacity={1}
      containerStyle={{
        backgroundColor: surface,
        borderTopLeftRadius: scaled(28),
        borderTopRightRadius: scaled(28),
      }}
      indicatorStyle={{ backgroundColor: line, width: scaled(48) }}
    >
      <View className="gap-2 px-4 pt-2 pb-4">
        {title && (
          <Text className="px-4 pb-2 text-[1.125rem] leading-6 font-bold text-ink">{title}</Text>
        )}
        {children}
      </View>
    </ActionSheet>
  );
}
