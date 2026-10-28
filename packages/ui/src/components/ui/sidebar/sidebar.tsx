'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Tooltip } from '@base-ui/react/tooltip';
import { usePortalContainer } from '@lib/portal-container';
import { isImageUrl } from '@lib/status';
import { twMerge } from '@lib/tw-merge';
import Select from '@ui/select/select';
import type { CustomTrigger } from '@ui/select/trigger';
import type {
  SidebarItem,
  SidebarLinkComponent,
  SidebarProps,
  SidebarProviderProps,
  SidebarSwitcher,
} from '@ui/types';
import { clsx } from 'clsx';
import { ChevronsUpDown, PanelLeft } from 'lucide-react';
import {
  createContext,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from 'react';

// Below md the sidebar is a drawer; from md to lg it's a rail unless the person expands it.
// Keep in step with the `rail` variant in src/styles/utilities.css.
const INLINE = '(min-width: 48rem)';
const WIDE = '(min-width: 64rem)';

// The project key and the person's initials sit on the same brand tile.
const tile =
  'grid size-11 shrink-0 place-items-center rounded-md bg-brand font-display text-[0.9375rem] leading-none font-extrabold text-on-brand uppercase font-stretch-condensed';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2);

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

interface SidebarState {
  id: string;
  drawerId: string;
  /** The person's choice; null follows the width. */
  collapsed: boolean | null;
  /** Showing the icon rail right now (JS view of the `rail` variant, for tooltips and ARIA). */
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
  const id = useId();
  const drawerId = useId();
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed);
  const [open, setOpen] = useState(false);
  const inline = useMediaQuery(INLINE);
  const wide = useMediaQuery(WIDE);
  const collapsed = collapsedProp === undefined ? ownCollapsed : collapsedProp;
  const rail = collapsed ?? !wide;

  const setCollapsed = (next: boolean | null) => {
    setOwnCollapsed(next);
    if (next !== null) onCollapsedChange?.(next);
  };

  // A drawer left open while the window widens (or a tablet rotates) would cover the page.
  useEffect(() => {
    if (inline) setOpen(false);
  }, [inline]);

  const toggle = () => {
    // Read the width at click time: the snapshots above are false until hydration.
    if (window.matchMedia(INLINE).matches) {
      setCollapsed(!(collapsed ?? !window.matchMedia(WIDE).matches));
    } else {
      setOpen(!open);
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        id,
        drawerId,
        collapsed,
        rail,
        drawer: !inline,
        open,
        setOpen,
        setCollapsed,
        toggle,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

/** The collapse button for the page header: opens the drawer on phones. */
const Toggle = () => {
  const { id, drawerId, drawer, rail, open, toggle } = useSidebar();
  return (
    <button
      type="button"
      aria-label="Sidebar"
      aria-controls={drawer ? drawerId : id}
      aria-expanded={drawer ? open : !rail}
      onClick={toggle}
      className={clsx(
        'grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover',
        focus,
      )}
    >
      <PanelLeft aria-hidden strokeWidth={2} className="size-6" />
    </button>
  );
};

const Root = (props: SidebarProps) => {
  const { id, drawerId, collapsed, open, setOpen } = useSidebar();
  const container = usePortalContainer();
  const label = props.label ?? 'Main';

  return (
    <>
      <aside
        id={id}
        data-sidebar={collapsed === null ? 'auto' : collapsed ? 'collapsed' : 'expanded'}
        className={clsx(
          'sticky top-0 hidden h-dvh max-h-full w-68 shrink-0 border-r border-line bg-canvas text-ink md:flex',
          'transition-[width] duration-200 ease-out motion-reduce:transition-none rail:w-[4.75rem]',
        )}
      >
        <Panel {...props} label={label} />
      </aside>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal container={container}>
          <Dialog.Backdrop
            className={clsx(
              'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-200',
              'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
            )}
          />
          <Dialog.Popup
            id={drawerId}
            className={clsx(
              'fixed inset-y-0 left-0 z-(--z-dialog) flex w-[min(17rem,85vw)] border-r border-line bg-canvas text-ink',
              'transition-transform duration-200 ease-out motion-reduce:transition-none',
              'data-ending-style:-translate-x-full data-starting-style:-translate-x-full',
            )}
          >
            <Dialog.Title className="sr-only">{label}</Dialog.Title>
            <Panel {...props} label={label} drawer onPicked={() => setOpen(false)} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

interface PanelProps extends SidebarProps {
  label: string;
  /** In the drawer: always full width, never the rail. */
  drawer?: boolean;
  onPicked?: () => void;
}

// The sidebar's contents, shared by the inline sidebar and the drawer. Rail styles use the `rail`
// variant, which only matches inside the inline <aside>.
const Panel = ({
  logo,
  logoCollapsed,
  project,
  sections,
  active,
  onNavigate,
  user,
  label,
  linkComponent,
  drawer,
  onPicked,
}: PanelProps) => {
  const { rail } = useSidebar();
  // The drawer is never a rail.
  const inRail = rail && !drawer;

  return (
    <Tooltip.Provider delay={300}>
      <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-hidden px-4 pt-6 pb-4">
        {(logo || logoCollapsed) && (
          <div className="flex h-10 items-center px-2 rail:justify-center rail:px-0">
            <span className="min-w-0 rail:hidden">{logo}</span>
            {logoCollapsed && <span className="hidden rail:block">{logoCollapsed}</span>}
          </div>
        )}

        {project && (
          <Switcher
            switcher={project}
            label={`${project.name}, switch project`}
            side={inRail ? 'right' : 'bottom'}
            align="start"
            className="border border-line bg-surface rail:border-transparent rail:bg-transparent"
          >
            <span aria-hidden className={tile}>
              {project.code}
            </span>
            <span className="min-w-0 flex-1 rail:hidden">
              <span className="block truncate font-display text-[1.25rem] leading-6 font-extrabold uppercase font-stretch-condensed">
                {project.name}
              </span>
              {project.meta && (
                <span className="block truncate text-meta text-ink-muted font-stretch-semi-condensed">
                  {project.meta}
                </span>
              )}
            </span>
          </Switcher>
        )}

        <nav aria-label={label} className="-mx-4 -my-2 min-h-0 flex-1 overflow-y-auto px-4 py-2">
          {sections.map((section, index) => (
            <Section key={section.title ?? index} title={section.title} first={index === 0}>
              {section.items.map((item) => (
                <li key={item.key}>
                  <Hint label={item.label} enabled={inRail}>
                    <NavItem
                      item={item}
                      current={item.key === active}
                      linkComponent={linkComponent}
                      onPress={() => {
                        onNavigate?.(item);
                        onPicked?.();
                      }}
                    />
                  </Hint>
                </li>
              ))}
            </Section>
          ))}
        </nav>

        {user && (
          <Switcher
            switcher={user}
            label={`${user.name}, account`}
            side={inRail ? 'right' : 'top'}
            align={inRail ? 'end' : 'start'}
          >
            <Avatar name={user.name} avatar={user.avatar} />
            <span className="min-w-0 flex-1 rail:hidden">
              <span className="block truncate text-body-strong font-stretch-semi-condensed">
                {user.name}
              </span>
              {user.email && (
                <span className="block truncate text-meta text-ink-muted font-stretch-semi-condensed">
                  {user.email}
                </span>
              )}
            </span>
          </Switcher>
        )}
      </div>
    </Tooltip.Provider>
  );
};

interface SwitcherProps {
  switcher: SidebarSwitcher;
  label: string;
  side: CustomTrigger['side'];
  align: CustomTrigger['align'];
  className?: string;
  children: ReactNode;
}

/** The project and account rows: a combobox when given options, else a button. */
const Switcher = ({ switcher, label, side, align, className, children }: SwitcherProps) => {
  const trigger = clsx(
    'flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 pr-3 text-left',
    'hover:bg-surface-hover data-popup-open:bg-surface-hover rail:p-0',
    focus,
    className,
  );
  const content = (
    <>
      {children}
      <ChevronsUpDown
        aria-hidden
        strokeWidth={2}
        className="size-5 shrink-0 text-ink-muted rail:hidden"
      />
    </>
  );

  if (!switcher.options) {
    return (
      <button type="button" aria-label={label} onClick={switcher.onPress} className={trigger}>
        {content}
      </button>
    );
  }
  return (
    <Select
      options={switcher.options}
      value={switcher.value}
      onValueChange={switcher.onValueChange}
      searchable={switcher.searchable ?? true}
      trigger={{ label, className: trigger, side, align, children: content }}
    />
  );
};

const Section = ({
  title,
  first,
  children,
}: {
  title?: string;
  first: boolean;
  children: ReactNode;
}) => {
  const titleId = useId();
  return (
    <div className={clsx(!first && 'mt-6 rail:mt-3')}>
      {title && (
        <>
          <p id={titleId} className="eyebrow px-4 pb-2 rail:sr-only">
            {title}
          </p>
          {/* The rail has no room for the overline: a hairline separates the groups instead. */}
          <hr aria-hidden className="mx-2 mb-3 hidden border-line rail:block" />
        </>
      )}
      <ul aria-labelledby={title ? titleId : undefined} className="flex flex-col gap-1">
        {children}
      </ul>
    </div>
  );
};

interface NavItemProps {
  item: SidebarItem;
  current: boolean;
  linkComponent?: SidebarLinkComponent;
  onPress: () => void;
}

const NavItem = ({
  item: { href, icon: Icon, label },
  current,
  linkComponent: Link = 'a' as unknown as SidebarLinkComponent,
  onPress,
  ...rest
}: NavItemProps) => {
  const className = clsx(
    'flex h-11 w-full cursor-pointer items-center gap-3 rounded-full px-4 text-left',
    'text-[1.0625rem] leading-5 font-bold text-ink font-stretch-semi-condensed',
    'hover:bg-surface-hover aria-[current=page]:bg-ink aria-[current=page]:text-on-ink',
    'rail:mx-auto rail:size-11 rail:justify-center rail:px-0',
    focus,
  );
  const content = (
    <>
      <Icon aria-hidden strokeWidth={2} className="size-6 shrink-0" />
      <span className="truncate rail:sr-only">{label}</span>
    </>
  );

  // `rest` carries the tooltip trigger's props.
  return href ? (
    <Link
      {...rest}
      href={href}
      aria-current={current ? 'page' : undefined}
      onClick={onPress}
      className={className}
    >
      {content}
    </Link>
  ) : (
    <button
      {...rest}
      type="button"
      aria-current={current ? 'page' : undefined}
      onClick={onPress}
      className={className}
    >
      {content}
    </button>
  );
};

const Avatar = ({ name, avatar }: { name: string; avatar?: string }) => {
  if (avatar && isImageUrl(avatar)) {
    return <img src={avatar} alt="" className="size-11 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span aria-hidden className={twMerge(tile, 'rounded-full')}>
      {avatar ?? initialsOf(name)}
    </span>
  );
};

/** A tooltip naming a rail item, whose label is visually hidden. */
const Hint = ({
  label,
  enabled,
  children,
}: {
  label: string;
  enabled: boolean;
  children: ReactElement<Record<string, unknown>>;
}) => {
  const container = usePortalContainer();
  if (!enabled) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal container={container}>
        <Tooltip.Positioner side="right" sideOffset={12} className="z-(--z-popover)">
          <Tooltip.Popup className="rounded-md bg-ink px-3 py-1.5 text-meta text-on-ink shadow-popover font-stretch-semi-condensed">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};

const Sidebar = { Provider, Root, Toggle };

export default Sidebar;
