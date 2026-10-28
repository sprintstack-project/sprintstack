import { scaled, touchSlop } from '@lib/scale';
import { Text } from '@sprintstack/ui';
import { ChevronDown, Ellipsis, ListPlus } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Sortable, { useItemContext } from 'react-native-sortables';
import { withUniwind } from 'uniwind';
import { useTokenColor } from '@/lib/use-token-color';
import type { WorkItem } from '../taskboard/data';
import { openItem } from '../taskboard/views';
import { ItemRow } from './item-row';

// Every group is drawn as entries of one sortable list (its header, its rows, its footer), so a row
// can be dragged anywhere and the screen scrolls while it's held near the edges. Each entry draws
// its slice of the group's card.

const AnimatedView = withUniwind(Animated.View);

const IconButton = ({
  label,
  onPress,
  expanded,
  children,
}: {
  label: string;
  onPress?: () => void;
  expanded?: boolean;
  children: ReactNode;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={expanded === undefined ? undefined : { expanded }}
    onPress={onPress}
    hitSlop={touchSlop(40)}
    className="size-10 items-center justify-center rounded-full active:bg-surface-pressed"
  >
    {children}
  </Pressable>
);

/** Keeps the first and last entries in place, so every row stays inside a group. */
const Pin = ({ pinned, children }: { pinned?: boolean; children: ReactNode }) =>
  pinned ? <Sortable.Handle mode="fixed-order">{children}</Sortable.Handle> : children;

interface GroupHeaderProps {
  title: string;
  /** After the title, e.g. the sprint's state. */
  badge?: ReactNode;
  /** Muted text under the title, e.g. the sprint's dates. */
  meta?: string;
  /** Under the meta, e.g. the points against capacity. */
  aside?: ReactNode;
  action?: ReactNode;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** The first entry of the list. */
  pinned?: boolean;
}

/** The top of a group's card; the whole card while it's collapsed. Rows dropped under it join it. */
export const GroupHeader = ({
  title,
  badge,
  meta,
  aside,
  action,
  collapsed,
  onCollapsedChange,
  pinned,
}: GroupHeaderProps) => {
  const ink = useTokenColor('ink');
  return (
    <Pin pinned={pinned}>
      <View
        className={`gap-4 border-x border-t border-line bg-surface p-4 ${collapsed ? 'rounded-2xl border-b' : 'rounded-t-2xl'}`}
      >
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <View className="-ml-2">
              <IconButton
                label={title}
                expanded={!collapsed}
                onPress={() => onCollapsedChange(!collapsed)}
              >
                <View className={collapsed ? '-rotate-90' : undefined}>
                  <ChevronDown aria-hidden size={scaled(22)} strokeWidth={2} color={ink} />
                </View>
              </IconButton>
            </View>
            <Text
              accessibilityRole="header"
              className="text-[1.75rem] leading-8 font-extrabold uppercase text-ink"
            >
              {title}
            </Text>
            {badge}
            <View className="flex-1" />
            <View className="-mr-2">
              <IconButton label={`${title} actions`}>
                <Ellipsis aria-hidden size={scaled(22)} strokeWidth={2} color={ink} />
              </IconButton>
            </View>
          </View>
          {meta && <Text className="text-meta font-semibold text-ink-muted">{meta}</Text>}
        </View>
        {!collapsed && aside}
        {!collapsed && action}
      </View>
    </Pin>
  );
};

/**
 * A row of a group's card. Hold it to drag it; tap it to open the item. Screen readers move it
 * through the "Move to" action instead.
 */
export const GroupRow = ({
  item,
  onMoveRequest,
}: {
  item: WorkItem;
  onMoveRequest: (item: WorkItem) => void;
}) => {
  const { activationAnimationProgress } = useItemContext();
  // Lifted, the row becomes a card of its own. Scaled out here: the style runs on the UI thread.
  const radius = scaled(12);
  const frame = useAnimatedStyle(() => ({
    borderRadius: activationAnimationProgress.value * radius,
  }));
  const outline = useAnimatedStyle(() => ({ opacity: activationAnimationProgress.value }));

  return (
    <Sortable.Handle>
      <AnimatedView style={frame} className="border-x border-line bg-surface px-4">
        {/* A plain Pressable: the sortables Touchable nested in the handle kept rows from dragging. */}
        <Pressable
          accessibilityRole="link"
          accessibilityHint="Hold to drag to another sprint"
          accessibilityActions={[
            { name: 'activate' },
            { name: 'move', label: 'Move to another sprint' },
          ]}
          onAccessibilityAction={(e) => {
            if (e.nativeEvent.actionName === 'move') onMoveRequest(item);
            else openItem(item);
          }}
          onPress={() => openItem(item)}
          className="border-t border-line py-4"
        >
          <ItemRow item={item} />
        </Pressable>
        <AnimatedView
          pointerEvents="none"
          style={outline}
          className="absolute -inset-px rounded-xl border-[1.5px] border-ink"
        />
      </AnimatedView>
    </Sortable.Handle>
  );
};

interface GroupFooterProps {
  collapsed: boolean;
  /** The drop hint, or null to leave it out. */
  hint: string | null;
  /** Under the hint, e.g. "Show more". */
  children?: ReactNode;
  /** The last entry of the list: pinned, with no gap after it. */
  last?: boolean;
}

/** The bottom of a group's card, and the gap before the next one. */
export const GroupFooter = ({ collapsed, hint, children, last }: GroupFooterProps) => {
  const muted = useTokenColor('ink-muted');
  return (
    <Pin pinned={last}>
      <View className={last ? undefined : 'pb-6'}>
        {!collapsed && (
          <View className="gap-4 rounded-b-2xl border-x border-b border-line bg-surface px-4 pb-4">
            {hint && (
              <View className="min-h-18 flex-row items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed border-line-strong px-4">
                <ListPlus aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
                <Text className="shrink text-center text-[1rem] leading-5 font-bold text-ink-muted">
                  {hint}
                </Text>
              </View>
            )}
            {children}
          </View>
        )}
      </View>
    </Pin>
  );
};
