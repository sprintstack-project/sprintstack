'use client';

import Notifications from '@ui/header/notifications';
import Sidebar from '@ui/sidebar/sidebar';
import type { HeaderCrumb, HeaderProps, SidebarLinkComponent } from '@ui/types';
import { clsx } from 'clsx';
import { Moon, Search, Sun } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

// The same round target as Sidebar.Toggle.
const iconButton = clsx(
  'relative grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover',
  focus,
);

const noSubscribe = () => () => {};

// The server renders the Mac hint; other platforms swap in "Ctrl K" after hydration.
const useIsMac = () =>
  useSyncExternalStore(
    noSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

const Header = ({
  toggle = true,
  breadcrumbs,
  onNavigate,
  linkComponent,
  search,
  notifications,
  theme,
  onThemeChange,
}: HeaderProps) => {
  const dark = theme === 'dark';
  const ThemeIcon = dark ? Sun : Moon;

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-canvas px-4 text-ink md:px-6">
      {toggle && (
        <>
          <Sidebar.Toggle />
          <span aria-hidden className="h-6 w-px shrink-0 bg-line" />
        </>
      )}

      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} onNavigate={onNavigate} linkComponent={linkComponent} />
        )}
      </div>

      {search && <SearchButton {...search} />}

      {notifications && <Notifications {...notifications} buttonClassName={iconButton} />}

      {onThemeChange && (
        <button
          type="button"
          aria-label="Dark theme"
          aria-pressed={dark}
          onClick={() => onThemeChange(dark ? 'light' : 'dark')}
          className={iconButton}
        >
          {/* Shows the theme a press switches to. */}
          <ThemeIcon aria-hidden strokeWidth={2} className="size-6" />
        </button>
      )}
    </header>
  );
};

const Breadcrumbs = ({
  crumbs,
  onNavigate,
  linkComponent: Link = 'a' as unknown as SidebarLinkComponent,
}: {
  crumbs: HeaderCrumb[];
  onNavigate?: HeaderProps['onNavigate'];
  linkComponent?: SidebarLinkComponent;
}) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex min-w-0 items-center gap-2 text-[1.25rem] leading-6 font-stretch-semi-condensed">
      {crumbs.map((crumb, index) => {
        const current = index === crumbs.length - 1;
        return (
          <li
            key={crumb.href ?? crumb.label}
            // Narrow screens keep only the current page.
            className={clsx(
              'min-w-0 items-center gap-2',
              current ? 'flex' : 'hidden shrink-[2] sm:flex',
            )}
          >
            {index > 0 && (
              <span aria-hidden className="hidden text-ink-muted sm:inline">
                /
              </span>
            )}
            {current ? (
              <span aria-current="page" className="truncate font-extrabold text-ink">
                {crumb.label}
              </span>
            ) : crumb.href ? (
              <Link
                href={crumb.href}
                onClick={() => onNavigate?.(crumb)}
                className={clsx(
                  'truncate rounded-sm font-bold text-ink-muted hover:text-ink',
                  focus,
                )}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="truncate font-bold text-ink-muted">{crumb.label}</span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

const SearchButton = ({
  onOpen,
  placeholder = 'Search or jump to…',
}: NonNullable<HeaderProps['search']>) => {
  const mac = useIsMac();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpen]);

  return (
    <button
      type="button"
      aria-label={placeholder}
      aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'}
      onClick={onOpen}
      className={clsx(
        // An icon button on narrow screens, the search pill from md.
        'grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover',
        'md:flex md:h-10 md:w-[21rem] md:gap-3 md:bg-surface-muted md:pr-1.5 md:pl-4 md:text-ink-muted md:hover:bg-surface-pressed',
        focus,
      )}
    >
      <Search aria-hidden strokeWidth={2} className="size-6 shrink-0 md:size-5" />
      <span className="hidden min-w-0 flex-1 truncate text-left text-[1.0625rem] leading-6 font-semibold font-stretch-semi-condensed md:block">
        {placeholder}
      </span>
      <kbd
        aria-hidden
        className="hidden shrink-0 rounded-md border border-line-strong px-2 py-0.5 font-sans text-badge text-ink-muted md:block"
      >
        {mac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  );
};

export default Header;
