import { commandOption, filterCommands } from '@lib/command';
import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useTokenColor } from '@lib/use-token-color.native';
import OptionContent from '@ui/select/option-content';
import { Text } from '@ui/text';
import type { CommandItem, CommandPaletteProps } from '@ui/types';
import { clsx } from 'clsx';
import { Search } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { FlatList } from 'react-native-actions-sheet';

type Row =
  | { kind: 'title'; key: string; title: string }
  | { kind: 'item'; key: string; item: CommandItem; first: boolean };

const CommandPalette = ({
  open,
  onOpenChange,
  groups,
  placeholder = 'Search or jump to…',
}: CommandPaletteProps) => {
  const sheet = useRef<SheetRef>(null);
  const muted = useTokenColor('ink-muted');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) sheet.current?.show();
    else sheet.current?.hide();
  }, [open]);

  // One flat list, so the sheet scrolls and virtualizes it: each group's title, then its items.
  const rows = filterCommands(groups, query).flatMap((group): Row[] => [
    { kind: 'title', key: `title:${group.title}`, title: group.title },
    ...group.items.map((item, index) => ({
      kind: 'item' as const,
      key: `${group.title}:${item.key}`,
      item,
      first: index === 0,
    })),
  ]);

  return (
    <Sheet
      sheetRef={sheet}
      onClose={() => {
        setQuery('');
        onOpenChange(false);
      }}
    >
      <View className="mb-1 h-12 flex-row items-center gap-3 rounded-full bg-surface-muted px-4">
        <Search aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          accessibilityLabel={placeholder}
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="go"
          // Return opens the first match, like Enter on web.
          onSubmitEditing={() => {
            const first = rows.find((row) => row.kind === 'item');
            if (first?.kind === 'item') {
              sheet.current?.hide();
              first.item.onSelect();
            }
          }}
          className="h-12 flex-1 text-[1.0625rem] text-ink"
          placeholderTextColorClassName="accent-ink-placeholder"
          cursorColorClassName="accent-ink"
        />
      </View>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        style={{ maxHeight: scaled(560) }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text className="p-4 font-semibold text-ink-muted">
            {query.trim() ? `No results for “${query.trim()}”` : 'Nothing to show'}
          </Text>
        }
        renderItem={({ item: row }) =>
          row.kind === 'title' ? (
            <Text
              accessibilityRole="header"
              className="px-4 pt-4 pb-1 text-eyebrow font-bold uppercase tracking-[.4px] text-ink-muted"
            >
              {row.title}
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={row.item.label}
              accessibilityHint={row.item.description}
              onPress={() => {
                sheet.current?.hide();
                row.item.onSelect();
              }}
              className={clsx(
                'min-h-14 flex-row items-center gap-4 rounded-md px-4 active:bg-surface-pressed',
                !row.first && 'border-t border-line',
              )}
            >
              <OptionContent option={commandOption(row.item)} />
            </Pressable>
          )
        }
      />
    </Sheet>
  );
};

export default CommandPalette;
