'use client';

import {
  type BellNotification,
  useNotifications,
  useRegisterPushDevice,
} from '@sprintstack/api-client';
import { initialsOf } from '@sprintstack/shared';
import type { HeaderNotification, HeaderNotifications } from '@sprintstack/ui';
import { CalendarClock } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { enablePush, type PushPermission, pushPermission } from './push';

// Rewritten to the API's SSE endpoint (next.config.ts), so the session cookie goes with it.
const STREAM = '/api/notifications/stream';
const RECONNECT = 10_000;
const MINUTE = 60_000;

// Pushes are extra to the bell, so failures are logged rather than shown.
const warn = (error: unknown) => console.warn('[push] Registration failed:', error);

type T = ReturnType<typeof useTranslations<'Notifications'>>;

const titleOf = ({ type, actor, workItem, sprint }: BellNotification, t: T) => {
  const who = actor?.name ?? t('someone');
  const item = workItem?.key ?? '';
  switch (type) {
    case 'assigned':
      return t('assigned', { actor: who, item });
    case 'mentioned':
      return t('mentioned', { actor: who, item });
    case 'commented':
      return t('commented', { actor: who, item });
    case 'status_changed':
      return t('status_changed', { actor: who, item });
    case 'sprint_starting':
      return t('sprint_starting', { sprint: sprint?.name ?? '' });
    case 'sprint_ending':
      return t('sprint_ending', { sprint: sprint?.name ?? '' });
  }
};

/**
 * The header's bell, live: the API's SSE stream says when it changed, and the browser shows pushes
 * through FCM while no tab is focused. Asks to turn pushes on from the bell, never unprompted.
 */
export const useBell = (): HeaderNotifications => {
  const t = useTranslations('Notifications');
  const format = useFormatter();
  // Read after mounting: the clock can't be read during the prerender (cacheComponents). The bell
  // has no notifications until then anyway.
  const [now, setNow] = useState<Date>();
  const { notifications, unread, refresh, markRead } = useNotifications();
  const registerDevice = useRegisterPushDevice();
  const [permission, setPermission] = useState<PushPermission>('unsupported');
  const onDevice = useCallback(
    async (fid: string) => {
      const { error } = await registerDevice(fid, 'web');
      if (error) warn(error);
    },
    [registerDevice],
  );

  useEffect(() => {
    let source: EventSource | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let connected = false;
    const connect = () => {
      source = new EventSource(STREAM);
      // A reconnect may have missed events.
      source.addEventListener('open', () => {
        if (connected) refresh();
        connected = true;
      });
      source.addEventListener('created', refresh);
      source.addEventListener('read', refresh);
      // The browser retries a dropped stream itself but gives up on an error response, like a 502
      // while the API deploys.
      source.addEventListener('error', () => {
        if (source?.readyState === EventSource.CLOSED) retry = setTimeout(connect, RECONNECT);
      });
    };
    connect();
    return () => {
      clearTimeout(retry);
      source?.close();
    };
  }, [refresh]);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), MINUTE);
    return () => clearInterval(timer);
  }, []);

  // Re-registers on every visit once allowed, so a browser shared between accounts follows
  // whoever signed in last. Firebase refuses while the browser reports itself offline, so it also
  // tries again on coming back online.
  useEffect(() => {
    const start = () =>
      pushPermission().then((current) => {
        setPermission(current);
        if (current === 'granted') enablePush(onDevice).catch(warn);
      });
    start();
    window.addEventListener('online', start);
    return () => window.removeEventListener('online', start);
  }, [onDevice]);

  const items = notifications.map(
    (notification): HeaderNotification => ({
      id: notification.id,
      title: titleOf(notification, t),
      description: notification.workItem?.title,
      time: now ? format.relativeTime(new Date(notification.createdAt), now) : '',
      avatar: notification.actor
        ? notification.actor.image || initialsOf(notification.actor.name)
        : undefined,
      // Sprint reminders have no actor.
      icon: notification.actor ? undefined : CalendarClock,
      unread: !notification.readAt,
    }),
  );

  return {
    items,
    unread,
    onSelect: (picked) => {
      if (picked.unread) markRead([picked.id]);
    },
    onMarkAllRead: () => markRead(),
    // Only while the browser can still ask: once blocked, only its site settings can undo it.
    prompt:
      permission === 'default'
        ? {
            label: t('enablePush'),
            action: t('enablePushAction'),
            onPress: () => {
              enablePush(onDevice).then(setPermission).catch(warn);
            },
          }
        : undefined,
  };
};
