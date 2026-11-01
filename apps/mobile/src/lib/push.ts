import { getApp } from '@react-native-firebase/app';
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  onRegistered,
  register,
  unregister,
} from '@react-native-firebase/messaging';
import {
  getPermissionsAsync,
  IosAuthorizationStatus,
  type NotificationPermissionsStatus,
  requestPermissionsAsync,
} from 'expo-notifications';

/**
 * Pushes through Firebase Cloud Messaging. The OS shows them while the app is in the background;
 * in the foreground they only refresh the bell. The device is known to the API by its Firebase
 * Installation ID (app.config.ts opts in).
 */

/** The bell notification a push is about (apps/api's push data). */
export interface PushData {
  notificationId?: string;
}

// Null where Firebase isn't set up (a build without its config files): the app runs without pushes.
const messaging = (() => {
  try {
    return getMessaging(getApp());
  } catch {
    return null;
  }
})();

// Provisional: iOS delivers quietly to Notification Center until the person chooses.
const isAllowed = ({ granted, ios }: NotificationPermissionsStatus) =>
  granted || ios?.status === IosAuthorizationStatus.PROVISIONAL;

/**
 * Asks once (Android 13+ and iOS); later calls return the answer without asking again. Only
 * expo-notifications' permission calls are used: Firebase delivers and reports the pushes.
 */
const allowed = async () => {
  const current = await getPermissionsAsync();
  if (isAllowed(current) || !current.canAskAgain) return isAllowed(current);
  return isAllowed(await requestPermissionsAsync());
};

/** unsupported: no Firebase in this build. denied: only the OS settings can turn pushes on. */
export type PushStatus = 'unsupported' | 'denied' | 'granted';

/**
 * Asks for permission and registers the device with FCM, handing its FID to `onDevice` now and
 * whenever FCM issues a new one. `stop` ends those calls.
 */
export const startPush = async (
  onDevice: (fid: string) => void,
): Promise<{ status: PushStatus; stop: () => void }> => {
  if (!messaging) return { status: 'unsupported', stop: () => {} };
  if (!(await allowed())) return { status: 'denied', stop: () => {} };
  const stop = onRegistered(messaging, onDevice);
  await register(messaging);
  return { status: 'granted', stop };
};

/**
 * Calls `onPush` for pushes arriving in the foreground, and `onOpen` when one is tapped: from the
 * background, or to launch the app (reported once, on the first call).
 */
export const listenToPushes = (
  onPush: (data: PushData) => void,
  onOpen: (data: PushData) => void,
) => {
  if (!messaging) return () => {};
  getInitialNotification(messaging).then((message) => message && onOpen(message.data ?? {}));
  const stops = [
    onMessage(messaging, (message) => onPush(message.data ?? {})),
    onNotificationOpenedApp(messaging, (message) => onOpen(message.data ?? {})),
  ];
  return () => {
    for (const stop of stops) stop();
  };
};

/**
 * On sign-out: FCM forgets this device, so the API drops it on the next send (the session is
 * already gone, so it can't be told). Signing in again registers it for that person.
 */
export const stopPush = async () => {
  if (!messaging) return;
  await unregister(messaging).catch(() => {});
};
