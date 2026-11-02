import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import SearchBox from '@ui/select/search-box';
import { Text } from '@ui/text';
import type { MentionItem, RichTextEditorProps } from '@ui/types';
import { clsx } from 'clsx';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { FlatList } from 'react-native-actions-sheet';

interface MentionSheetProps {
  sheetRef: RefObject<SheetRef | null>;
  search: NonNullable<RichTextEditorProps['searchMentions']>;
  onPick: (item: MentionItem) => void;
}

/** Native's mention picker: a searchable list in a sheet, opened from the toolbar's @ button. */
const MentionSheet = ({ sheetRef, search, onPick }: MentionSheetProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MentionItem[] | null>(null);
  // Callers often pass a fresh function each render; only the query should re-run the search.
  const searchRef = useRef(search);
  searchRef.current = search;

  // Search while the sheet is open; a slower, older answer never replaces a newer one.
  useEffect(() => {
    if (!open) return;
    let current = true;
    const timer = setTimeout(async () => {
      const items = await searchRef.current(query);
      if (current) setResults(items);
    }, 150);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [open, query]);

  return (
    <Sheet
      sheetRef={sheetRef}
      title="Mention"
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setQuery('');
        setResults(null);
      }}
    >
      <SearchBox value={query} onChange={setQuery} />
      <FlatList
        data={results ?? []}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: scaled(480) }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text className="p-4 font-semibold text-ink-muted">
            {results === null
              ? 'Searching…'
              : query
                ? `No one matches “${query}”`
                : 'No one to mention'}
          </Text>
        }
        renderItem={({ item, index }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              item.description ? `${item.label}, ${item.description}` : item.label
            }
            onPress={() => {
              sheetRef.current?.hide();
              onPick(item);
            }}
            className={clsx(
              'min-h-14 justify-center rounded-md px-4 py-2 active:bg-surface-pressed',
              index > 0 && 'border-t border-line',
            )}
          >
            <View className="min-w-0">
              <Text numberOfLines={1} className="text-[1.0625rem] leading-6 font-semibold text-ink">
                {item.label}
              </Text>
              {item.description && (
                <Text numberOfLines={1} className="text-meta text-ink-muted">
                  {item.description}
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </Sheet>
  );
};

export default MentionSheet;
