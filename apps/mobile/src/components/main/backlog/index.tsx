import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { Button, Text } from '@sprintstack/ui';
import { format } from 'date-fns';
import { Check, Plus } from 'lucide-react-native';
import { type Dispatch, type SetStateAction, useRef, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { AnimatedRef } from 'react-native-reanimated';
import Sortable from 'react-native-sortables';
import { useTokenColor } from '@/lib/use-token-color';
import type { WorkItem } from '../taskboard/data';
import {
  BACKLOG,
  BACKLOG_PAGE,
  filterItems,
  moveTo,
  NO_FILTERS,
  type PlannedItem,
  regroup,
  SPRINTS,
  type Sprint,
  sumPoints,
} from './data';
import { GroupFooter, GroupHeader, GroupRow } from './group';
import { Toolbar } from './toolbar';

const GROUPS = [
  ...SPRINTS.map((s) => ({ id: s.id, name: s.name })),
  { id: BACKLOG, name: 'Backlog' },
];
const GROUP_IDS = GROUPS.map((g) => g.id);

/** An entry of the one sortable list the groups are drawn as. */
type Entry =
  | { key: string; kind: 'header' | 'footer'; group: string }
  | { key: string; kind: 'row'; group: string; item: PlannedItem };

const SprintState = ({ state }: { state: Sprint['state'] }) => (
  <View
    className={`h-7 flex-row items-center rounded-full px-3 ${state === 'active' ? 'bg-brand' : 'bg-neutral-subtle'}`}
  >
    <Text
      className={`text-[0.8125rem] leading-4 font-extrabold uppercase tracking-[.4px] ${state === 'active' ? 'text-on-brand' : 'text-ink-muted'}`}
    >
      {state}
    </Text>
  </View>
);

/** Points planned into the sprint against what the team can take; red once it's over. */
const Capacity = ({ sprint, points }: { sprint: Sprint; points: number }) => {
  const over = points > sprint.capacity;
  return (
    <View className="flex-row items-center gap-4">
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`${sprint.name} capacity`}
        accessibilityValue={{
          min: 0,
          max: sprint.capacity,
          now: points,
          text: `${points} of ${sprint.capacity} points`,
        }}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
      >
        <View
          className={`h-full rounded-full ${over ? 'bg-danger' : 'bg-ink'}`}
          style={{ width: `${Math.min(100, (points / sprint.capacity) * 100)}%` }}
        />
      </View>
      <Text className={`text-meta font-semibold ${over ? 'text-danger' : 'text-ink-muted'}`}>
        {points} / {sprint.capacity} pts
      </Text>
    </View>
  );
};

interface BacklogProps {
  scrollRef: AnimatedRef<Animated.ScrollView>;
  /** Held by the page, so items made with its "New item" button join the backlog. */
  items: PlannedItem[];
  onItemsChange: Dispatch<SetStateAction<PlannedItem[]>>;
}

export const Backlog = ({
  scrollRef,
  items: allItems,
  onItemsChange: setAllItems,
}: BacklogProps) => {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const sheet = useRef<SheetRef>(null);
  const [moving, setMoving] = useState<WorkItem | null>(null);
  const check = useTokenColor('brand-ink');
  const { width: windowWidth } = useWindowDimensions();

  const items = filterItems(allItems, filters);
  const inGroup = (group: string) => items.filter((i) => i.group === group);
  const backlog = inGroup(BACKLOG);
  const backlogShown = showAll ? backlog : backlog.slice(0, BACKLOG_PAGE);
  const backlogHidden = backlog.length - backlogShown.length;
  const unplanned = allItems.filter((i) => i.group === BACKLOG).length;
  const groupOf = (key: string) => allItems.find((i) => i.key === key)?.group;

  const shownIn = (group: string) => (group === BACKLOG ? backlogShown : inGroup(group));
  const isCollapsed = (group: string) => collapsed.includes(group);
  const collapse = (group: string) => (next: boolean) =>
    setCollapsed((all) => (next ? [...all, group] : all.filter((g) => g !== group)));

  const entries: Entry[] = GROUP_IDS.flatMap((group) => [
    { key: `header:${group}`, kind: 'header' as const, group },
    ...(isCollapsed(group)
      ? []
      : shownIn(group).map((item) => ({ key: item.key, kind: 'row' as const, group, item }))),
    { key: `footer:${group}`, kind: 'footer' as const, group },
  ]);

  // A dropped row joins the group whose header is above it.
  const onDragEnd = (data: Entry[]) => {
    let group = GROUP_IDS[0];
    const order = data.flatMap((entry) => {
      if (entry.kind === 'header') group = entry.group;
      return entry.kind === 'row' ? [{ key: entry.key, group }] : [];
    });
    setAllItems(regroup(order, GROUP_IDS));
  };

  const showMove = (item: WorkItem) => {
    setMoving(item);
    sheet.current?.show();
  };

  const header = (group: string) => {
    const sprint = SPRINTS.find((s) => s.id === group);
    const common = {
      collapsed: isCollapsed(group),
      onCollapsedChange: collapse(group),
      pinned: group === GROUP_IDS[0],
    };
    if (!sprint) {
      return (
        <GroupHeader
          title="Backlog"
          meta={`${backlogShown.length} of ${backlog.length} shown · ranked by priority`}
          {...common}
        />
      );
    }
    return (
      <GroupHeader
        title={sprint.name}
        badge={<SprintState state={sprint.state} />}
        meta={`${format(sprint.start, 'd MMM')} – ${format(sprint.end, 'd MMM')}`}
        aside={
          <Capacity
            sprint={sprint}
            points={sumPoints(allItems.filter((i) => i.group === sprint.id))}
          />
        }
        action={
          sprint.state === 'planned' && (
            <Button variant="primary" size="lg" block>
              Start sprint
            </Button>
          )
        }
        {...common}
      />
    );
  };

  const footer = (group: string) => {
    const empty = shownIn(group).length === 0;
    // Planning happens in the sprints not yet started, so they always show where to drop.
    const planned = SPRINTS.find((s) => s.id === group)?.state === 'planned';
    const filteredOut = group === BACKLOG && empty && unplanned > 0;
    return (
      <GroupFooter
        collapsed={isCollapsed(group)}
        hint={
          filteredOut
            ? 'No backlog items match these filters'
            : planned || empty
              ? 'Hold an item and drag it here'
              : null
        }
        last={group === GROUP_IDS[GROUP_IDS.length - 1]}
      >
        {group === BACKLOG && backlog.length > BACKLOG_PAGE && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowAll(!showAll)}
            className="-mb-4 h-14 items-center justify-center border-t border-line active:bg-surface-pressed"
          >
            <Text className="text-[1.0625rem] leading-5 font-extrabold text-ink">
              {showAll ? 'Show fewer' : `Show ${backlogHidden} more`}
            </Text>
          </Pressable>
        )}
      </GroupFooter>
    );
  };

  /** Moves `key` to the end of `group`'s rows, ahead of any behind "Show more". */
  const moveToEnd = (key: string, group: string) =>
    setAllItems(
      moveTo(key, group, group === BACKLOG && backlogHidden > 0 ? backlog[BACKLOG_PAGE].key : null),
    );

  return (
    <>
      <View>
        <Text className="text-sm font-bold uppercase text-ink-muted">
          {unplanned} unplanned · {SPRINTS.length} sprints
        </Text>
        <Text
          accessibilityRole="header"
          className="text-4xl leading-14 font-extrabold uppercase text-ink"
        >
          Backlog
        </Text>
      </View>
      <Toolbar filters={filters} onFiltersChange={setFilters} />
      <Sortable.Grid
        // The grid keeps the width it first measured, so it starts over when the window changes
        // size (a foldable opening or closing, a rotation). The items live here, so nothing is lost.
        key={windowWidth}
        data={entries}
        keyExtractor={(entry) => entry.key}
        customHandle
        overDrag="vertical"
        scrollableRef={scrollRef}
        activeItemScale={1.03}
        onDragEnd={({ data }) => onDragEnd(data)}
        renderItem={({ item: entry }) =>
          entry.kind === 'row' ? (
            <GroupRow item={entry.item} onMoveRequest={showMove} />
          ) : entry.kind === 'header' ? (
            header(entry.group)
          ) : (
            footer(entry.group)
          )
        }
      />
      <Button variant="secondary" size="lg" icon={Plus} block>
        New sprint
      </Button>
      <Sheet
        sheetRef={sheet}
        title={moving ? `Move ${moving.key} to` : undefined}
        onClose={() => setMoving(null)}
      >
        {GROUPS.map((group, i) => {
          const here = moving !== null && groupOf(moving.key) === group.id;
          return (
            <Pressable
              key={group.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: here }}
              onPress={() => {
                sheet.current?.hide();
                if (moving && !here) moveToEnd(moving.key, group.id);
              }}
              className={`min-h-14 flex-row items-center gap-4 rounded-md px-4 active:bg-surface-pressed ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <Text className="flex-1 text-[1.0625rem] leading-6 font-bold text-ink">
                {group.name}
              </Text>
              {here && <Check aria-hidden size={scaled(24)} strokeWidth={2} color={check} />}
            </Pressable>
          );
        })}
      </Sheet>
    </>
  );
};
