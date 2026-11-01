import { Inject, Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { Observable } from 'rxjs';
import { REDIS_CLIENT } from '../redis/redis.module';

/** What changed in someone's bell. Events carry nothing else: clients refetch what they show. */
export type NotificationEvent = 'created' | 'read';

const channel = (userId: string) => `notifications:${userId}`;

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * Fans bell changes out to every API instance over Redis pub/sub, so a user's open streams hear
 * about them whichever instance holds them. Each instance subscribes to a user's channel while it
 * holds at least one of their streams.
 */
@Injectable()
export class RedisPushService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisPushService.name);
  // A connection in subscribe mode can run nothing else, so subscriptions get their own. Unlike
  // the shared client it queues while disconnected, so a stream opened during an outage still
  // subscribes once Redis is back (ioredis resubscribes the rest itself).
  private readonly subscriber: Redis;
  private readonly listeners = new Map<string, Set<(event: NotificationEvent) => void>>();

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    this.subscriber = redis.duplicate({ enableOfflineQueue: true });
    // The shared client already logs outages; this keeps ioredis from logging each retry again.
    this.subscriber.on('error', () => {});
    this.subscriber.on('message', (name: string, event: string) => {
      for (const listener of this.listeners.get(name) ?? []) listener(event as NotificationEvent);
    });
  }

  /** Tells the user's open streams. Failures are logged: clients also refetch on focus. */
  async publish(userId: string, event: NotificationEvent) {
    try {
      await this.redis.publish(channel(userId), event);
    } catch (error) {
      this.logger.warn(`Publish to ${userId} failed: ${errorMessage(error)}`);
    }
  }

  /** The user's events until unsubscribed. */
  stream(userId: string) {
    return new Observable<NotificationEvent>((subscriber) => {
      const name = channel(userId);
      const listener = (event: NotificationEvent) => subscriber.next(event);
      let listeners = this.listeners.get(name);
      if (!listeners) {
        listeners = new Set();
        this.listeners.set(name, listeners);
        this.subscriber.subscribe(name).catch((error) => {
          this.logger.warn(`Subscribe to ${userId} failed: ${errorMessage(error)}`);
        });
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size) return;
        this.listeners.delete(name);
        this.subscriber.unsubscribe(name).catch(() => {});
      };
    });
  }

  async onModuleDestroy() {
    await this.subscriber.quit().catch(() => this.subscriber.disconnect());
  }
}
