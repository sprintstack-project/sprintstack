import { Platform } from 'react-native';

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1'];

/**
 * The Android emulator's localhost is the emulator itself; the dev machine is at 10.0.2.2. Rewrites
 * loopback URLs to it so the .env defaults work there. LAN IPs and tunnels are left as they are.
 */
export const hostUrl = (url: string) => {
  if (Platform.OS !== 'android') return url;
  const parsed = new URL(url);
  if (!LOOPBACK_HOSTS.includes(parsed.hostname)) return url;
  parsed.hostname = '10.0.2.2';
  // URL appends a trailing slash to a bare origin, which would change the caller's URL.
  return url.endsWith('/') ? parsed.toString() : parsed.toString().replace(/\/$/, '');
};
