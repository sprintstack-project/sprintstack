'use client';

import { Popover } from '@base-ui/react/popover';
import { usePortalContainer } from '@lib/portal-container';
import { isImageUrl } from '@lib/status';
import { popupFrame } from '@ui/select/menu';
import type { HeaderNotification, HeaderNotifications } from '@ui/types';
import { clsx } from 'clsx';
import { Bell, BellOff } from 'lucide-react';
import { useState } from 'react';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

const textButton = clsx(
  'cursor-pointer rounded-sm text-meta font-bold text-brand-ink underline-offset-4 hover:underline font-stretch-semi-condensed',
  focus,
);

/** The bell and its dropdown. */
const Notifications = ({
  items,
  onSelect,
  onMarkAllRead,
  onViewAll,
  unread: unreadProp,
  buttonClassName,
}: HeaderNotifications & { buttonClassName: string }) => {
  const container = usePortalContainer();
  const [open, setOpen] = useState(false);
  const unread = unreadProp ?? items.filter((item) => item.unread).length;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        className={clsx(buttonClassName, 'data-popup-open:bg-surface-hover')}
      >
        <Bell aria-hidden strokeWidth={2} className="size-6" />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute top-1.5 right-2 size-2.5 rounded-full bg-brand-ink ring-2 ring-canvas"
          />
        )}
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner side="bottom" align="end" sideOffset={8} className="z-(--z-popover)">
          <Popover.Popup
            className={clsx(
              popupFrame,
              'flex max-h-[min(var(--available-height),36rem)] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden text-ink',
            )}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-line px-5 py-4">
              <Popover.Title className="flex-1 text-heading">Notifications</Popover.Title>
              {onMarkAllRead && unread > 0 && (
                <button type="button" onClick={onMarkAllRead} className={textButton}>
                  Mark all as read
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-ink-muted">
                <BellOff aria-hidden strokeWidth={2} className="size-6" />
                <p className="font-semibold">You're all caught up</p>
              </div>
            ) : (
              <ul className="min-h-0 flex-1 overflow-y-auto p-2">
                {items.map((item) => (
                  <li key={item.id} className="[&+&]:border-t [&+&]:border-line">
                    <Row
                      item={item}
                      onPress={() => {
                        setOpen(false);
                        onSelect?.(item);
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}

            {onViewAll && (
              <div className="shrink-0 border-t border-line px-5 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onViewAll();
                  }}
                  className={textButton}
                >
                  View all notifications
                </button>
              </div>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

const Row = ({ item, onPress }: { item: HeaderNotification; onPress: () => void }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onPress}
      className={clsx(
        'flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-3 text-left hover:bg-surface-hover',
        focus,
      )}
    >
      {item.avatar && isImageUrl(item.avatar) ? (
        <img src={item.avatar} alt="" className="size-10 shrink-0 rounded-full object-cover" />
      ) : (
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-muted text-meta font-bold text-ink"
        >
          {Icon ? <Icon aria-hidden strokeWidth={2} className="size-5" /> : item.avatar}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={clsx(
            'block text-body font-stretch-semi-condensed',
            item.unread ? 'font-bold' : 'text-ink-muted',
          )}
        >
          {item.title}
        </span>
        {item.description && (
          <span className="block truncate text-meta text-ink-muted font-stretch-semi-condensed">
            {item.description}
          </span>
        )}
        <span className="block text-meta text-ink-muted font-stretch-semi-condensed">
          {item.time}
        </span>
      </span>
      {item.unread && (
        <span className="mt-2 size-2.5 shrink-0 rounded-full bg-brand-ink">
          <span className="sr-only">Unread</span>
        </span>
      )}
    </button>
  );
};

export default Notifications;
