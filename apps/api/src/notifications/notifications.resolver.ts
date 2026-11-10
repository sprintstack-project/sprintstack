import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { uuidSchema } from '@/common.schema';
import { ValidateArgs } from '@/zod-validation.decorator';
import type { Auth } from '../auth/auth';
import { PushPlatform } from '../generated/prisma/enums';
import { NotificationModel } from './notification.model';
import { fidSchema, notificationIdsSchema } from './notifications.schema';
import { NotificationsService } from './notifications.service';

const MAX_PAGE = 50;

/** The signed-in user's bell and the devices their pushes go to. */
@Resolver(() => NotificationModel)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [NotificationModel], { description: 'Newest first.' })
  @ValidateArgs({ after: uuidSchema.nullish() })
  notifications(
    @Session() session: UserSession<Auth>,
    @Args('first', { type: () => Int, defaultValue: 20 }) first: number,
    @Args('after', { type: () => ID, nullable: true, description: 'The last id already shown.' })
    after?: string | null,
  ) {
    return this.notificationsService.list(session.user.id, {
      first: Math.min(Math.max(first, 1), MAX_PAGE),
      after,
    });
  }

  @Query(() => Int)
  unreadNotificationCount(@Session() session: UserSession<Auth>) {
    return this.notificationsService.unreadCount(session.user.id);
  }

  @Mutation(() => Int, { description: 'Marks these, or all without ids, read. Returns how many.' })
  @ValidateArgs({ ids: notificationIdsSchema })
  markNotificationsRead(
    @Session() session: UserSession<Auth>,
    @Args('ids', { type: () => [ID], nullable: true }) ids?: string[] | null,
  ) {
    return this.notificationsService.markRead(session.user.id, ids);
  }

  @Mutation(() => Boolean, {
    description: "Sends the user's pushes to this device (its Firebase Installation ID).",
  })
  @ValidateArgs({ fid: fidSchema })
  async registerPushDevice(
    @Session() session: UserSession<Auth>,
    @Args('fid') fid: string,
    @Args('platform', { type: () => PushPlatform }) platform: PushPlatform,
  ) {
    await this.notificationsService.registerDevice(session.user.id, fid, platform);
    return true;
  }

  @Mutation(() => Boolean, { description: 'Stops pushes to this device. Call before signing out.' })
  @ValidateArgs({ fid: fidSchema })
  async unregisterPushDevice(@Session() session: UserSession<Auth>, @Args('fid') fid: string) {
    await this.notificationsService.unregisterDevice(session.user.id, fid);
    return true;
  }
}
