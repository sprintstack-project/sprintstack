import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, isSupported, onRegistered, register, unregister } from 'firebase/messaging';

/**
 * Browser pushes through Firebase Cloud Messaging. The browser's push subscription belongs to
 * public/push-sw.js, which shows pushes while no SprintStack tab is focused (a focused tab has the
 * bell, kept live over SSE). The device is known to the API by its Firebase Installation ID.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const SERVICE_WORKER = '/push-sw.js';

/** granted, denied (only the browser's site settings can undo it), default (not asked yet). */
export type PushPermission = NotificationPermission | 'unsupported';

const app = (): FirebaseApp => getApps()[0] ?? initializeApp(config);

/** Unsupported without Firebase config, or where the browser can't push (e.g. iOS Safari tabs). */
export const pushPermission = async (): Promise<PushPermission> => {
  if (!config.apiKey || !config.appId || !vapidKey) return 'unsupported';
  if (typeof Notification === 'undefined' || !(await isSupported())) return 'unsupported';
  return Notification.permission;
};

/**
 * Registers this browser with FCM and hands its FID to `onDevice`, now and whenever FCM issues a
 * new one. Asks for permission first if needed, so call it from a click while it's `default`.
 * Resolves to the permission afterwards.
 */
export const enablePush = async (onDevice: (fid: string) => void): Promise<PushPermission> => {
  const permission = await pushPermission();
  if (permission === 'unsupported' || permission === 'denied') return permission;
  if (permission === 'default' && (await Notification.requestPermission()) !== 'granted') {
    return Notification.permission;
  }
  const serviceWorkerRegistration = await navigator.serviceWorker.register(SERVICE_WORKER);
  const messaging = getMessaging(app());
  onRegistered(messaging, onDevice);
  await register(messaging, { vapidKey, serviceWorkerRegistration });
  return 'granted';
};

/**
 * On sign-out: FCM forgets this browser, so the API drops it on the next send (the session is
 * already gone, so it can't be told). Signing in again registers it for that person.
 */
export const disablePush = async () => {
  if ((await pushPermission()) !== 'granted') return;
  try {
    await unregister(getMessaging(app()));
  } catch {
    // Never registered (pushes were turned on elsewhere, or not at all).
  }
};
