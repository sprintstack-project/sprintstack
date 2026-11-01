import { Controller, type MessageEvent, Sse } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { interval, map, merge, type Observable } from 'rxjs';
import type { Auth } from '../auth/auth';
import { RedisPushService } from './redis-push.service';

// Under the idle timeouts of Cloudflare (100s) and most proxies, so quiet streams stay open.
const HEARTBEAT = 25_000;

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly redisPush: RedisPushService) {}

  /**
   * Server-sent events telling the signed-in user's tab that their bell changed: `created` or
   * `read`, plus a `ping` heartbeat. The browser reconnects by itself when the stream drops (on
   * deploys, or at Railway's request time limit); refetch then too, in case an event was missed.
   */
  @Sse('stream')
  stream(@Session() session: UserSession<Auth>): Observable<MessageEvent> {
    return merge(
      this.redisPush.stream(session.user.id).pipe(map((type) => ({ type, data: {} }))),
      interval(HEARTBEAT).pipe(map(() => ({ type: 'ping', data: {} }))),
    );
  }
}
