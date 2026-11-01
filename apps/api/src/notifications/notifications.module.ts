import { Module } from '@nestjs/common';
import { FirebasePushService } from './firebase-push.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { RedisPushService } from './redis-push.service';

/** The bell: stored notifications, live updates over SSE, and pushes through FCM. */
@Module({
  controllers: [NotificationsController],
  providers: [RedisPushService, NotificationsResolver, NotificationsService, FirebasePushService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
