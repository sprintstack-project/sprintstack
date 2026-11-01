import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cert, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

export interface Push {
  title: string;
  body: string;
  /** The app icon's badge on iOS: the user's unread count. */
  badge: number;
  /** Read by the apps when the push is tapped. FCM only carries strings. */
  data: Record<string, string>;
}

// FCM's answers for a device that uninstalled the app, revoked permission or expired.
const UNREGISTERED = new Set([
  'messaging/installation-id-not-registered',
  'messaging/registration-token-not-registered',
]);

/** Sends pushes through Firebase Cloud Messaging to iOS, Android and web devices alike. */
@Injectable()
export class FirebasePushService {
  private readonly logger = new Logger(FirebasePushService.name);
  private readonly messaging?: Messaging;

  constructor(config: ConfigService) {
    // Like Mailjet in development: without credentials nothing is sent.
    const serviceAccount = config.get<string>('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccount) {
      this.logger.log('FIREBASE_SERVICE_ACCOUNT is not set, so pushes are off');
      return;
    }
    this.messaging = getMessaging(initializeApp({ credential: cert(JSON.parse(serviceAccount)) }));
  }

  get enabled() {
    return Boolean(this.messaging);
  }

  /** Sends to each device (Firebase Installation IDs) and returns those FCM no longer knows. */
  async send(fids: string[], { title, body, badge, data }: Push) {
    if (!this.messaging || !fids.length) return [];
    const { responses } = await this.messaging.sendEachForMulticast({
      fids,
      notification: { title, body },
      data,
      apns: { payload: { aps: { badge, sound: 'default' } } },
      android: { priority: 'high' },
    });
    return fids.filter((_, index) => UNREGISTERED.has(responses[index]?.error?.code ?? ''));
  }
}
