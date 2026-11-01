import { EventEmitter } from 'node:events';
import { Test } from '@nestjs/testing';
import { firstValueFrom, take, toArray } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { FirebasePushService } from './firebase-push.service';
import { NotificationsService } from './notifications.service';
import { RedisPushService } from './redis-push.service';

// One bus stands in for Redis: publishes from the shared client reach every subscribed duplicate.
const createFakeRedis = () => {
  const bus = new EventEmitter();
  const subscriber = Object.assign(new EventEmitter(), {
    channels: new Set<string>(),
    subscribe: vi.fn(async (name: string) => subscriber.channels.add(name)),
    unsubscribe: vi.fn(async (name: string) => subscriber.channels.delete(name)),
    quit: vi.fn(async () => 'OK'),
  });
  bus.on('message', (name: string, message: string) => {
    if (subscriber.channels.has(name)) subscriber.emit('message', name, message);
  });
  return {
    subscriber,
    publish: vi.fn(async (name: string, message: string) => bus.emit('message', name, message)),
    duplicate: () => subscriber,
  };
};

const NOTIFICATION = {
  id: 'n1',
  userId: 'ana',
  actorId: 'ben',
  type: 'assigned',
  workItemId: 'w1',
  sprintId: null,
  readAt: null,
  createdAt: new Date(),
  actor: { id: 'ben', name: 'Ben', image: null },
  workItem: { number: 1482, title: 'Retry failed payouts', project: { key: 'PAY' } },
  sprint: null,
};

describe('NotificationsService', () => {
  let redis: ReturnType<typeof createFakeRedis>;
  let prisma: {
    notification: Record<'create' | 'count' | 'updateMany', ReturnType<typeof vi.fn>>;
    pushDevice: Record<'findMany' | 'deleteMany', ReturnType<typeof vi.fn>>;
  };
  let firebasePush: { enabled: boolean; send: ReturnType<typeof vi.fn> };
  let service: NotificationsService;
  let redisPush: RedisPushService;

  beforeEach(async () => {
    redis = createFakeRedis();
    prisma = {
      notification: {
        create: vi.fn(async () => NOTIFICATION),
        count: vi.fn(async () => 3),
        updateMany: vi.fn(async () => ({ count: 2 })),
      },
      pushDevice: {
        findMany: vi.fn(async () => [{ fid: 'phone' }, { fid: 'old-tablet' }]),
        deleteMany: vi.fn(async () => ({ count: 1 })),
      },
    };
    firebasePush = { enabled: true, send: vi.fn(async () => ['old-tablet']) };
    const module = await Test.createTestingModule({
      providers: [
        NotificationsService,
        RedisPushService,
        { provide: REDIS_CLIENT, useValue: redis },
        { provide: PrismaService, useValue: prisma },
        { provide: FirebasePushService, useValue: firebasePush },
      ],
    }).compile();
    service = module.get(NotificationsService);
    redisPush = module.get(RedisPushService);
  });

  it('tells the recipient’s open streams', async () => {
    const received = firstValueFrom(redisPush.stream('ana'));
    await service.notify({ userId: 'ana', actorId: 'ben', type: 'assigned', workItemId: 'w1' });
    expect(await received).toBe('created');
  });

  it('pushes to the recipient’s devices and forgets the ones FCM no longer knows', async () => {
    await service.notify({ userId: 'ana', actorId: 'ben', type: 'assigned', workItemId: 'w1' });
    await vi.waitFor(() => expect(prisma.pushDevice.deleteMany).toHaveBeenCalled());
    expect(firebasePush.send).toHaveBeenCalledWith(['phone', 'old-tablet'], {
      title: 'Ben assigned you',
      body: 'PAY-1482 Retry failed payouts',
      badge: 3,
      data: { notificationId: 'n1', type: 'assigned', workItemId: 'w1' },
    });
    expect(prisma.pushDevice.deleteMany).toHaveBeenCalledWith({
      where: { fid: { in: ['old-tablet'] } },
    });
  });

  it('skips what people did themselves', async () => {
    expect(await service.notify({ userId: 'ana', actorId: 'ana', type: 'commented' })).toBeNull();
    expect(prisma.notification.create).not.toHaveBeenCalled();
  });

  it('keeps the notification when the push fails', async () => {
    firebasePush.send.mockRejectedValue(new Error('FCM is down'));
    expect(await service.notify({ userId: 'ana', actorId: 'ben', type: 'assigned' })).toBe(
      NOTIFICATION,
    );
  });

  it('announces reads only when something changed', async () => {
    const received = firstValueFrom(redisPush.stream('ana'));
    expect(await service.markRead('ana')).toBe(2);
    expect(await received).toBe('read');
    prisma.notification.updateMany.mockResolvedValue({ count: 0 });
    await service.markRead('ana', ['n1']);
    expect(redis.publish).toHaveBeenCalledTimes(1);
  });
});

describe('RedisPushService', () => {
  it('subscribes once per user and unsubscribes after their last stream closes', async () => {
    const redis = createFakeRedis();
    const redisPush = new RedisPushService(redis as never);
    const tabs = [redisPush.stream('ana').subscribe(), redisPush.stream('ana').subscribe()];
    expect(redis.subscriber.subscribe).toHaveBeenCalledTimes(1);
    tabs[0].unsubscribe();
    expect(redis.subscriber.unsubscribe).not.toHaveBeenCalled();
    tabs[1].unsubscribe();
    expect(redis.subscriber.unsubscribe).toHaveBeenCalledWith('notifications:ana');
  });

  it('only delivers the user’s own events', async () => {
    const redis = createFakeRedis();
    const redisPush = new RedisPushService(redis as never);
    const received = firstValueFrom(redisPush.stream('ana').pipe(take(2), toArray()));
    await redisPush.publish('ben', 'created');
    await redisPush.publish('ana', 'created');
    await redisPush.publish('ana', 'read');
    expect(await received).toEqual(['created', 'read']);
  });
});
