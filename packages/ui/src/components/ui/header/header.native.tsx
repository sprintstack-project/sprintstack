import { scaled, touchSlop } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import Notifications from '@ui/header/notifications';
import Sidebar from '@ui/sidebar/sidebar';
import { Avatar, Switcher, tile, tileText } from '@ui/sidebar/switcher';
import { Text } from '@ui/text';
import type { HeaderCrumb, HeaderProps, SidebarProject } from '@ui/types';
import { clsx } from 'clsx';
import { ChevronDown, Moon, Search, Sun } from 'lucide-react-native';
import { Pressable, useWindowDimensions, View } from 'react-native';

// Phones (the sidebar's drawer widths) get the current page only and a search icon button. With
// no sidebar beside them, `project` and `user` take the breadcrumbs' and theme switch's places.
const COMPACT_BELOW = 600;

// The same round target as Sidebar.Toggle.
const iconButton = 'size-10 items-center justify-center rounded-full active:bg-surface-pressed';

const Header = ({
  toggle = true,
  breadcrumbs,
  onNavigate,
  search,
  notifications,
  theme,
  onThemeChange,
  project,
  user,
}: HeaderProps) => {
  const { width } = useWindowDimensions();
  const compact = width < COMPACT_BELOW;
  const ink = useTokenColor('ink');
  const dark = theme === 'dark';
  const ThemeIcon = dark ? Sun : Moon;
  const crumbs = compact ? breadcrumbs?.slice(-1) : breadcrumbs;
  const showProject = compact && project;
  const showUser = compact && user;

  return (
    <View className="h-16 flex-row items-center gap-3 border-b border-line bg-canvas px-4">
      {toggle && (
        <>
          <Sidebar.Toggle />
          <View className="h-6 w-px bg-line" />
        </>
      )}

      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        {showProject ? (
          <ProjectSwitcher project={project} />
        ) : (
          crumbs?.map((crumb, index) => (
            <Crumb
              key={crumb.href ?? crumb.label}
              crumb={crumb}
              separator={index > 0}
              current={index === crumbs.length - 1}
              onNavigate={onNavigate}
            />
          ))
        )}
      </View>

      {search && <SearchButton {...search} compact={compact} />}

      {notifications && <Notifications {...notifications} buttonClassName={iconButton} />}

      {showUser ? (
        <Switcher
          switcher={user}
          label={`${user.name}, account`}
          hitSlop={touchSlop(36)}
          className="ml-1 rounded-full active:opacity-80"
        >
          <Avatar name={user.name} avatar={user.avatar} className="size-9" />
        </Switcher>
      ) : (
        onThemeChange && (
          <Pressable
            accessibilityRole="switch"
            accessibilityLabel="Dark theme"
            accessibilityState={{ checked: dark }}
            onPress={() => onThemeChange(dark ? 'light' : 'dark')}
            hitSlop={touchSlop(40)}
            className={iconButton}
          >
            {/* Shows the theme a press switches to. */}
            <ThemeIcon aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
          </Pressable>
        )
      )}
    </View>
  );
};

/** The phone header's project row: key tile, name and a caret, opening the project list. */
const ProjectSwitcher = ({ project }: { project: SidebarProject }) => {
  const muted = useTokenColor('ink-muted');
  return (
    <Switcher
      switcher={project}
      label={`${project.name}, switch project`}
      className="min-w-0 shrink flex-row items-center gap-3 rounded-lg py-1 pr-2 active:opacity-70"
    >
      <View className={clsx(tile, 'size-9 rounded-md')}>
        <Text className={tileText}>{project.code}</Text>
      </View>
      <Text
        numberOfLines={1}
        className="shrink text-[1.25rem] leading-6 font-extrabold uppercase text-ink"
      >
        {project.name}
      </Text>
      <ChevronDown aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
    </Switcher>
  );
};

const Crumb = ({
  crumb,
  separator,
  current,
  onNavigate,
}: {
  crumb: HeaderCrumb;
  separator: boolean;
  current: boolean;
  onNavigate?: HeaderProps['onNavigate'];
}) => {
  const label = (
    <Text
      numberOfLines={1}
      accessibilityRole={current ? 'header' : undefined}
      className={clsx(
        'text-[1.25rem] leading-6',
        current ? 'font-extrabold text-ink' : 'font-bold text-ink-muted',
      )}
    >
      {crumb.label}
    </Text>
  );

  return (
    <View className={clsx('min-w-0 flex-row items-center gap-2', !current && 'shrink-[2]')}>
      {separator && (
        <Text aria-hidden className="text-[1.25rem] leading-6 font-bold text-ink-muted">
          /
        </Text>
      )}
      {!current && onNavigate ? (
        <Pressable
          accessibilityRole="link"
          onPress={() => onNavigate(crumb)}
          className="min-w-0 active:opacity-70"
        >
          {label}
        </Pressable>
      ) : (
        label
      )}
    </View>
  );
};

const SearchButton = ({
  onOpen,
  placeholder = 'Search or jump to…',
  compact,
}: NonNullable<HeaderProps['search']> & { compact: boolean }) => {
  const ink = useTokenColor('ink');
  const muted = useTokenColor('ink-muted');

  if (compact) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={placeholder}
        onPress={onOpen}
        hitSlop={touchSlop(40)}
        className={iconButton}
      >
        <Search aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      onPress={onOpen}
      hitSlop={touchSlop(40)}
      className="h-10 w-[21rem] flex-row items-center gap-3 rounded-full bg-surface-muted px-4 active:bg-surface-pressed"
    >
      <Search aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
      <Text numberOfLines={1} className="flex-1 text-[1.0625rem] font-semibold text-ink-muted">
        {placeholder}
      </Text>
    </Pressable>
  );
};

export default Header;
