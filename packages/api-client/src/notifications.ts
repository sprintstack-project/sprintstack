import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from 'urql';
import { graphql, type ResultOf } from './graphql';

const BellQuery = graphql(`
  query Bell {
    notifications(first: 20) {
      id
      type
      readAt
      createdAt
      actor {
        id
        name
        image
      }
      workItem {
        id
        key
        title
      }
      sprint {
        id
        name
      }
    }
    unreadNotificationCount
  }
`);

export type BellNotification = ResultOf<typeof BellQuery>['notifications'][number];

const MarkNotificationsReadMutation = graphql(`
  mutation MarkNotificationsRead($ids: [ID!]) {
    markNotificationsRead(ids: $ids)
  }
`);

const RegisterPushDeviceMutation = graphql(`
  mutation RegisterPushDevice($fid: String!, $platform: PushPlatform!) {
    registerPushDevice(fid: $fid, platform: $platform)
  }
`);

export type PushPlatform = 'ios' | 'android' | 'web';

/**
 * The signed-in user's bell: the newest notifications and the unread count. Call `refresh` when
 * something says the bell changed (an SSE event on web, a push or returning to the app on
 * mobile); `markRead` updates the cache straight away (src/cache.ts).
 */
export const useNotifications = () => {
  // Paused during Next's server render: there's no session there, and running a query reads the
  // clock (urql's dev timestamps), which cacheComponents refuses while prerendering.
  const [{ data }, reexecute] = useQuery({
    query: BellQuery,
    pause: typeof window === 'undefined',
  });
  const [, markReadMutation] = useMutation(MarkNotificationsReadMutation);

  const refresh = useCallback(() => reexecute({ requestPolicy: 'network-only' }), [reexecute]);
  /** These notifications, or all of them without ids. */
  const markRead = useCallback(
    (ids?: string[]) => markReadMutation({ ids: ids ?? null }),
    [markReadMutation],
  );

  return useMemo(
    () => ({
      notifications: data?.notifications ?? [],
      unread: data?.unreadNotificationCount ?? 0,
      refresh,
      markRead,
    }),
    [data, refresh, markRead],
  );
};

/** Sends the user's pushes to this device, given its Firebase Installation ID. */
export const useRegisterPushDevice = () => {
  const [, register] = useMutation(RegisterPushDeviceMutation);
  return useCallback(
    (fid: string, platform: PushPlatform) => register({ fid, platform }),
    [register],
  );
};
