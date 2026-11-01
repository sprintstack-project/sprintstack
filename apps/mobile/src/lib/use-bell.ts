import {
  type BellNotification,
  useNotifications,
  useRegisterPushDevice,
} from '@sprintstack/api-client';
import { initialsOf } from '@sprintstack/shared';
import type { HeaderNotification, HeaderNotifications } from '@sprintstack/ui';
import { formatDistanceStrict } from 'date-fns';
import { CalendarClock } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import { useNow, useTranslations } from 'use-intl';
import { listenToPushes, type PushStatus, startPush } from './push';

type T = ReturnType<typeof useTranslations<'Notifications'>>;

// Same as the web's (apps/web/src/lib/use-bell.ts).
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
 * The header's bell. Native has no SSE stream: it refreshes when the app comes back to the
 * foreground and when a push arrives, and a tapped push marks its notification read. Asks for
 * push permission on the first signed-in launch.
 */
export const useBell = (): HeaderNotifications => {
  const t = useTranslations('Notifications');
  const now = useNow({ updateInterval: 60_000 });
  const { notifications, unread, refresh, markRead } = useNotifications();
  const registerDevice = useRegisterPushDevice();
  const [status, setStatus] = useState<PushStatus>('unsupported');
  const statusRef = useRef(status);

  // Registers on every launch, so a device shared between accounts follows whoever signed in last.
  // Coming back from the OS settings asks again, in case pushes were turned on there.
  useEffect(() => {
    let mounted = true;
    let stop = () => {};
    // Fails on iOS builds without the Push Notifications entitlement.
    const start = () => {
      stop();
      startPush((fid) => registerDevice(fid, Platform.OS === 'ios' ? 'ios' : 'android'))
        .catch(() => ({ status: 'unsupported' as const, stop: () => {} }))
        .then((result) => {
          if (!mounted) return result.stop();
          stop = result.stop;
          statusRef.current = result.status;
          setStatus(result.status);
        });
    };
    start();
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', (next) => {
      if (previous !== 'active' && next === 'active') {
        refresh();
        if (statusRef.current === 'denied') start();
      }
      previous = next;
    });
    return () => {
      mounted = false;
      stop();
      subscription.remove();
    };
  }, [registerDevice, refresh]);

  useEffect(
    () =>
      listenToPushes(refresh, ({ notificationId }) => {
        if (notificationId) markRead([notificationId]);
        refresh();
      }),
    [refresh, markRead],
  );

  const items = notifications.map(
    (notification): HeaderNotification => ({
      id: notification.id,
      title: titleOf(notification, t),
      description: notification.workItem?.title,
      time: formatDistanceStrict(new Date(notification.createdAt), now, { addSuffix: true }),
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
    prompt:
      status === 'denied'
        ? {
            label: t('pushBlocked'),
            action: t('pushBlockedAction'),
            onPress: () => Linking.openSettings(),
          }
        : undefined,
  };
};
