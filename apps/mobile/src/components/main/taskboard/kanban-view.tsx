import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { STATUS_LABEL } from '@lib/status';
import { Badge, type StatusTone, Text } from '@sprintstack/ui';
import { Check } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { KanbanBoard, type KanbanColumnData } from 'react-native-kanban-dnd';
import { useUniwind } from 'uniwind';
import { useTokenColor } from '@/lib/use-token-color';
import { BoardCard } from './board-card';
import { COLUMNS, columnOf, type WorkItem } from './data';
import { Empty, openItem } from './views';

type Update = (all: WorkItem[]) => WorkItem[];

/** The board identifies cards by `id`; ours carry the work item alongside. */
interface Card {
  id: string;
  item: WorkItem;
}

type Column = KanbanColumnData<Card> & { tone: StatusTone };

/**
 * Moves `key` into `column` at `toIndex` among the cards shown there (counted without it), by
 * placing it before the card now at that spot in the full list, or at the end. Blocked work keeps
 * its status while it stays in progress.
 */
const moveTo =
  (key: string, column: StatusTone, toIndex: number, shown: WorkItem[]): Update =>
  (all) => {
    const item = all.find((i) => i.key === key);
    if (!item) return all;
    const status = columnOf(item.status) === column ? item.status : column;
    const rest = all.filter((i) => i.key !== key);
    const before = shown.filter((i) => i.key !== key && columnOf(i.status) === column)[toIndex];
    const at = before ? rest.findIndex((i) => i.key === before.key) : -1;
    rest.splice(at === -1 ? rest.length : at, 0, { ...item, status });
    return rest;
  };

/** A pill per column with its count. */
const ColumnCount = ({ tone, count }: { tone: StatusTone; count: number }) => (
  <View className="h-11 flex-row items-center gap-2 rounded-full border-[1.5px] border-line-strong pr-2 pl-4">
    <Text className="text-[1rem] leading-5 font-extrabold text-ink">{STATUS_LABEL[tone]}</Text>
    <View className="size-6 items-center justify-center rounded-full bg-surface-muted">
      <Text className="text-[0.8125rem] font-extrabold text-ink">{count}</Text>
    </View>
  </View>
);

interface KanbanViewProps {
  items: WorkItem[];
  /** Applies a move to the full list (filters may be hiding some of it). */
  onItemsChange: (update: Update) => void;
}

/**
 * One column per stage, a little narrower than the screen so the next one peeks in. Hold a card to
 * drag it; the board scrolls sideways (and columns down) near the edges. Screen readers move cards
 * through the "Move to" action instead.
 */
export const KanbanView = ({ items, onItemsChange }: KanbanViewProps) => {
  const sheet = useRef<SheetRef>(null);
  const [moving, setMoving] = useState<WorkItem | null>(null);
  const { width: screen, height: screenHeight } = useWindowDimensions();
  const { theme } = useUniwind();
  const check = useTokenColor('brand-ink');
  const columnBackground = useTokenColor('surface-muted');
  const columnHighlight = useTokenColor('surface-pressed');

  const columns: Column[] = COLUMNS.map((tone) => ({
    id: tone,
    tone,
    title: STATUS_LABEL[tone],
    cards: items
      .filter((item) => columnOf(item.status) === tone)
      .map((item) => ({ id: item.key, item })),
  }));

  // Columns scroll on their own, so the board needs a height; the page scrolls if it's short.
  const boardHeight = Math.max(scaled(560), screenHeight * 0.62);
  // The board's styles take numbers, so the spec sizes go through scaled().
  const boardStyles = useMemo(
    () => ({
      boardContent: { paddingHorizontal: scaled(24), paddingVertical: 0 },
      column: { borderRadius: scaled(16) },
      columnContent: { paddingHorizontal: scaled(16), paddingTop: 0, paddingBottom: scaled(16) },
    }),
    [],
  );
  const boardTheme = useMemo(
    () => ({ columnBackground, columnHighlightBackground: columnHighlight }),
    [columnBackground, columnHighlight],
  );

  const showMove = (item: WorkItem) => {
    setMoving(item);
    sheet.current?.show();
  };

  return (
    <>
      {/* Both rows bleed to the screen edges so they scroll out from under the padding. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-6"
        contentContainerClassName="gap-3 px-6"
      >
        {columns.map((column) => (
          <ColumnCount key={column.id} tone={column.tone} count={column.cards.length} />
        ))}
      </ScrollView>
      <View className="-mx-6" style={{ height: boardHeight }}>
        <KanbanBoard<Card, Column>
          columns={columns}
          onMoveCard={({ card, toColumnId, toIndex }) =>
            onItemsChange(moveTo(card.id, toColumnId as StatusTone, toIndex, items))
          }
          columnWidth={Math.min(screen - scaled(128), scaled(480))}
          columnGap={scaled(16)}
          cardGap={scaled(16)}
          dragRotation="0deg"
          colorScheme={theme === 'dark' ? 'dark' : 'light'}
          theme={boardTheme}
          styles={boardStyles}
          renderColumnHeader={({ column }) => {
            const points = column.cards.reduce((sum, card) => sum + card.item.points, 0);
            return (
              <View className="flex-row items-center gap-3 px-5 pt-5 pb-3">
                <Text
                  accessibilityRole="header"
                  className="flex-1 text-title font-extrabold uppercase text-ink"
                >
                  {column.title}
                </Text>
                <Text className="text-meta font-semibold text-ink-muted">{points} pts</Text>
              </View>
            );
          }}
          renderEmptyColumn={() => <Empty>Nothing here</Empty>}
          renderCard={({ card, isDragging }) => (
            <Pressable
              accessibilityRole="link"
              accessibilityHint="Hold to drag to another column"
              accessibilityActions={[{ name: 'move', label: 'Move to another column' }]}
              onAccessibilityAction={(e) => {
                if (e.nativeEvent.actionName === 'move') showMove(card.item);
              }}
              onPress={() => openItem(card.item)}
              className={`rounded-xl border bg-surface p-4 active:bg-surface-pressed ${isDragging ? 'border-ink' : 'border-line'}`}
            >
              <BoardCard item={card.item} />
            </Pressable>
          )}
        />
      </View>
      <Text className="text-center text-meta font-semibold text-ink-muted">
        Swipe for more columns · hold a card to move it
      </Text>
      <Sheet
        sheetRef={sheet}
        title={moving ? `Move ${moving.key} to` : undefined}
        onClose={() => setMoving(null)}
      >
        {COLUMNS.map((tone, i) => {
          const here = moving !== null && columnOf(moving.status) === tone;
          return (
            <Pressable
              key={tone}
              accessibilityRole="radio"
              accessibilityLabel={STATUS_LABEL[tone]}
              accessibilityState={{ checked: here }}
              onPress={() => {
                sheet.current?.hide();
                if (moving && !here) onItemsChange(moveTo(moving.key, tone, Infinity, items));
              }}
              className={`min-h-14 flex-row items-center gap-4 rounded-md px-4 active:bg-surface-pressed ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <View className="flex-1">
                <Badge tone={tone} />
              </View>
              {here && <Check aria-hidden size={scaled(24)} strokeWidth={2} color={check} />}
            </Pressable>
          );
        })}
      </Sheet>
    </>
  );
};
