import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import type { NotificationType, PushPlatform } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { FirebasePushService } from './firebase-push.service';
import { RedisPushService } from './redis-push.service';

export interface NotifyInput {
  /** Who hears about it. */
  userId: string;
  /** Who did it; null for reminders. */
  actorId?: string | null;
  type: NotificationType;
  workItemId?: string;
  sprintId?: string;
}

const ACTOR = { select: { id: true, name: true, image: true } } as const;

// What the bell and pushes show: who, and the item or sprint it's about.
const SUBJECTS = {
  actor: ACTOR,
  workItem: {
    select: { id: true, number: true, title: true, project: { select: { key: true } } },
  },
  sprint: { select: { id: true, name: true } },
} as const satisfies Prisma.NotificationInclude;

type PushedNotification = Prisma.NotificationGetPayload<{ include: typeof SUBJECTS }>;

type PushSubject = Pick<PushedNotification, 'actor' | 'workItem' | 'sprint'>;

// The bell writes its own text in the viewer's language; a push has to carry it. English until
// users have a locale on the API.
const PUSH_TEXT: Record<NotificationType, (subject: PushSubject) => { title: string }> = {
  assigned: ({ actor }) => ({ title: `${actor?.name ?? 'Someone'} assigned you` }),
  mentioned: ({ actor }) => ({ title: `${actor?.name ?? 'Someone'} mentioned you` }),
  commented: ({ actor }) => ({ title: `${actor?.name ?? 'Someone'} commented` }),
  status_changed: ({ actor }) => ({ title: `${actor?.name ?? 'Someone'} changed the status` }),
  sprint_starting: ({ sprint }) => ({ title: `${sprint?.name ?? 'Your sprint'} starts tomorrow` }),
  sprint_ending: ({ sprint }) => ({ title: `${sprint?.name ?? 'Your sprint'} ends tomorrow` }),
};

/** "PAY-1482". */
const itemKey = ({ number, project }: { number: number; project: { key: string } }) =>
  `${project.key}-${number}`;

const pushText = (type: NotificationType, subject: PushSubject) => {
  const { workItem } = subject;
  const body = workItem ? `${itemKey(workItem)} ${workItem.title}` : '';
  return { ...PUSH_TEXT[type](subject), body };
};

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/**
 * The bell. `notify` saves a notification, tells the recipient's open tabs over SSE and pushes it
 * to their devices. Callers decide who hears about what (the project's notification rules).
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisPush: RedisPushService,
    private readonly firebasePush: FirebasePushService,
  ) {}

  /**
   * Saves the notification and tells the user's open tabs before resolving. The push goes out
   * after, so a slow FCM doesn't hold up the mutation; its failures are logged.
   */
  async notify(input: NotifyInput) {
    // Nobody hears about what they did themselves.
    if (input.actorId && input.actorId === input.userId) return null;
    const notification = await this.prisma.notification.create({
      data: input,
      include: SUBJECTS,
    });
    await this.redisPush.publish(input.userId, 'created');
    void this.push(notification);
    return notification;
  }

  /** Newest first. `after` is the id of the last one already shown. */
  async list(userId: string, { first, after }: { first: number; after?: string | null }) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      include: SUBJECTS,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: first,
      ...(after && { cursor: { id: after }, skip: 1 }),
    });
    return notifications.map(({ workItem, ...notification }) => ({
      ...notification,
      workItem: workItem && { id: workItem.id, key: itemKey(workItem), title: workItem.title },
    }));
  }

  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  /** Marks these (or all) of the user's notifications read and returns how many changed. */
  async markRead(userId: string, ids?: string[] | null) {
    const { count } = await this.prisma.notification.updateMany({
      where: { userId, readAt: null, ...(ids && { id: { in: ids } }) },
      data: { readAt: new Date() },
    });
    if (count) await this.redisPush.publish(userId, 'read');
    return count;
  }

  /** Points the device's pushes at the user, taking it over from whoever had it before. */
  async registerDevice(userId: string, fid: string, platform: PushPlatform) {
    await this.prisma.pushDevice.upsert({
      where: { fid },
      create: { userId, fid, platform },
      update: { userId, platform },
    });
  }

  /** On sign-out, so the next person on the device doesn't get this user's pushes. */
  async unregisterDevice(userId: string, fid: string) {
    await this.prisma.pushDevice.deleteMany({ where: { userId, fid } });
  }

  private async push({ id, userId, type, workItemId, sprintId, ...subject }: PushedNotification) {
    if (!this.firebasePush.enabled) return;
    try {
      const devices = await this.prisma.pushDevice.findMany({
        where: { userId },
        select: { fid: true },
      });
      if (!devices.length) return;
      const data = Object.fromEntries(
        Object.entries({ notificationId: id, type, workItemId, sprintId }).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        ),
      );
      const unregistered = await this.firebasePush.send(
        devices.map(({ fid }) => fid),
        { ...pushText(type, subject), badge: await this.unreadCount(userId), data },
      );
      if (unregistered.length) {
        await this.prisma.pushDevice.deleteMany({ where: { fid: { in: unregistered } } });
      }
    } catch (error) {
      this.logger.warn(`Push of ${id} failed: ${errorMessage(error)}`);
    }
  }
}
