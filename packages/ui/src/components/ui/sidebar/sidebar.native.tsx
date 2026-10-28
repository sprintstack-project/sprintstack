import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Avatar, Switcher, tile, tileText } from '@ui/sidebar/switcher';
import { Text } from '@ui/text';
import type { SidebarItem, SidebarProps, SidebarProviderProps, SidebarSwitcher } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronsUpDown, PanelLeft } from 'lucide-react-native';
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Modal,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// By window width in dp, so a foldable switches layout as it opens: a drawer on phones (and a
// folded foldable), a rail on tablets in portrait and open foldables, the full sidebar from WIDE.
const DRAWER_BELOW = 600;
const WIDE = 1024;

// Spec px; keep in step with the w-[17rem] / w-[4.75rem] widths on web.
const FULL_WIDTH = 'w-[18rem]';
const RAIL_WIDTH = 'w-[4.75rem]';

interface SidebarState {
  /** The person's choice; null follows the width. */
  collapsed: boolean | null;
  /** Showing the icon rail. */
  rail: boolean;
  /** The sidebar is a drawer at this width. */
  drawer: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean | null) => void;
  /** What the header toggle does: open the drawer on phones, else collapse or expand. */
  toggle: () => void;
}

const SidebarContext = createContext<SidebarState | null>(null);

export const useSidebar = () => {
  const state = useContext(SidebarContext);
  if (!state) throw new Error('Sidebar parts must be inside <Sidebar.Provider>.');
  return state;
};

const Provider = ({
  children,
  collapsed: collapsedProp,
  defaultCollapsed = null,
  onCollapsedChange,
}: SidebarProviderProps) => {
  const { width } = useWindowDimensions();
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed);
  const [open, setOpen] = useState(false);
  const drawer = width < DRAWER_BELOW;
  const collapsed = collapsedProp === undefined ? ownCollapsed : collapsedProp;
  const rail = !drawer && (collapsed ?? width < WIDE);

  const setCollapsed = (next: boolean | null) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOwnCollapsed(next);
    if (next !== null) onCollapsedChange?.(next);
  };

  // Unfolding (or rotating) with the drawer open: the sidebar is inline now.
  useEffect(() => {
    if (!drawer) setOpen(false);
  }, [drawer]);

  const toggle = () => {
    if (drawer) setOpen(!open);
    else setCollapsed(!rail);
  };

  return (
    <SidebarContext.Provider
      value={{ collapsed, rail, drawer, open, setOpen, setCollapsed, toggle }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

/** The collapse button for the page header: opens the drawer on phones. */
const Toggle = () => {
  const { drawer, rail, open, toggle } = useSidebar();
  const ink = useTokenColor('ink');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sidebar"
      accessibilityState={{ expanded: drawer ? open : !rail }}
      onPress={toggle}
      hitSlop={touchSlop(40)}
      className="size-10 items-center justify-center rounded-full active:bg-surface-pressed"
    >
      <PanelLeft aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
    </Pressable>
  );
};

const Root = (props: SidebarProps) => {
  const { drawer, rail, open, setOpen } = useSidebar();
  const insets = useSafeAreaInsets();
  const label = props.label ?? 'Main';

  if (drawer) {
    return (
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Panel {...props} label={label} rail={false} onPicked={() => setOpen(false)} />
      </Drawer>
    );
  }

  return (
    <View
      className={clsx('h-full border-r border-line bg-canvas', rail ? RAIL_WIDTH : FULL_WIDTH)}
      // The sidebar runs edge to edge, so it keeps clear of the status bar, home indicator and,
      // in landscape, the camera cut-out.
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left }}
    >
      <Panel {...props} label={label} rail={rail} />
    </View>
  );
};

/** Slides in from the left over a scrim; the back button and the scrim close it. */
const Drawer = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(open);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) setMounted(true);
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !open) setMounted(false);
    });
  }, [open, progress]);

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View className="absolute inset-0 bg-scrim" style={{ opacity: progress }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close navigation"
          onPress={onClose}
          className="flex-1"
        />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        className="absolute top-0 bottom-0 left-0 w-[17rem] max-w-[85%] border-r border-line bg-canvas"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          transform: [
            { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] }) },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Modal>
  );
};

interface PanelProps extends SidebarProps {
  label: string;
  rail: boolean;
  onPicked?: () => void;
}

// The sidebar's contents, shared by the inline sidebar and the drawer.
const Panel = ({
  logo,
  logoCollapsed,
  project,
  sections,
  active,
  onNavigate,
  user,
  label,
  rail,
  onPicked,
}: PanelProps) => {
  const shownLogo = rail ? logoCollapsed : logo;

  return (
    <View className="flex-1 gap-5 px-4 pt-6 pb-4">
      {shownLogo && (
        <View className={clsx('h-10 flex-row items-center', rail ? 'justify-center' : 'px-2')}>
          {shownLogo}
        </View>
      )}

      {project && (
        <SwitcherRow
          switcher={project}
          label={`${project.name}, switch project`}
          rail={rail}
          className={rail ? undefined : 'border border-line bg-surface'}
        >
          <View className={clsx(tile, 'rounded-md')}>
            <Text className={tileText}>{project.code}</Text>
          </View>
          {!rail && (
            <View className="min-w-0 flex-1">
              <Text
                numberOfLines={1}
                className="text-[1.25rem] leading-6 font-extrabold uppercase text-ink"
              >
                {project.name}
              </Text>
              {project.meta && (
                <Text numberOfLines={1} className="text-meta font-semibold text-ink-muted">
                  {project.meta}
                </Text>
              )}
            </View>
          )}
        </SwitcherRow>
      )}

      <ScrollView
        accessibilityLabel={label}
        className="-mx-4 flex-1"
        contentContainerClassName="px-4"
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, index) => (
          <View
            key={section.title ?? index}
            className={clsx(index > 0 && (rail ? 'mt-3' : 'mt-6'))}
          >
            {section.title &&
              (rail ? (
                // The rail has no room for the overline: a hairline separates the groups instead.
                <View className="mx-2 mb-3 h-px bg-line" />
              ) : (
                <Text
                  accessibilityRole="header"
                  className="px-4 pb-2 text-eyebrow font-bold uppercase tracking-[.4px] text-ink-muted"
                >
                  {section.title}
                </Text>
              ))}
            <View className="gap-1">
              {section.items.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  current={item.key === active}
                  rail={rail}
                  onPress={() => {
                    onNavigate?.(item);
                    onPicked?.();
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {user && (
        <SwitcherRow switcher={user} label={`${user.name}, account`} rail={rail}>
          <Avatar name={user.name} avatar={user.avatar} />
          {!rail && (
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="text-body-strong font-bold text-ink">
                {user.name}
              </Text>
              {user.email && (
                <Text numberOfLines={1} className="text-meta font-semibold text-ink-muted">
                  {user.email}
                </Text>
              )}
            </View>
          )}
        </SwitcherRow>
      )}
    </View>
  );
};

/** The project and account rows, with the up-down chevron unless in the rail. */
const SwitcherRow = ({
  rail,
  className,
  children,
  ...rest
}: {
  switcher: SidebarSwitcher;
  label: string;
  rail: boolean;
  className?: string;
  children: ReactNode;
}) => {
  const muted = useTokenColor('ink-muted');
  return (
    <Switcher
      {...rest}
      className={clsx(
        'flex-row items-center gap-3 rounded-lg active:bg-surface-pressed',
        !rail && 'p-2 pr-3',
        className,
      )}
    >
      {children}
      {!rail && <ChevronsUpDown aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />}
    </Switcher>
  );
};

const NavItem = ({
  item: { icon: Icon, label },
  current,
  rail,
  onPress,
}: {
  item: SidebarItem;
  current: boolean;
  rail: boolean;
  onPress: () => void;
}) => {
  const iconColor = useTokenColor(current ? 'on-ink' : 'ink');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: current }}
      onPress={onPress}
      // Rows sit 4px apart, so the slop only reaches sideways in the rail.
      hitSlop={rail ? { left: touchSlop(44), right: touchSlop(44) } : undefined}
      className={clsx(
        'h-11 flex-row items-center gap-3 rounded-full',
        rail ? 'w-11 self-center justify-center' : 'px-4',
        current ? 'bg-ink' : 'active:bg-surface-pressed',
      )}
    >
      <Icon aria-hidden size={scaled(24)} strokeWidth={2} color={iconColor} />
      {!rail && (
        <Text
          numberOfLines={1}
          className={clsx(
            'flex-1 text-[1.0625rem] leading-5 font-bold',
            current ? 'text-on-ink' : 'text-ink',
          )}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const Sidebar = { Provider, Root, Toggle };

export default Sidebar;
