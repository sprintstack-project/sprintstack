import { Global, Inject, Logger, Module, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const logger = new Logger('Redis');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redis = new Redis(config.getOrThrow<string>('REDIS_URL'), {
          // Railway's private network is IPv6-only; 0 resolves both address families.
          family: 0,
          // Fail commands while disconnected instead of queueing them, so @Cacheable falls back
          // to the database straight away rather than stalling requests until Redis is back.
          enableOfflineQueue: false,
        });
        // ioredis retries by itself and emits 'error' on every attempt, so log once per outage.
        // Refused dual-stack connects are AggregateErrors with no message, only a code.
        let down = false;
        redis.on('error', (error: NodeJS.ErrnoException) => {
          if (down) return;
          down = true;
          logger.warn(
            `Unavailable, caching is off until it reconnects: ${error.message || error.code}`,
          );
        });
        redis.on('ready', () => {
          if (down) logger.log('Reconnected, caching is back on');
          down = false;
        });
        return redis;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit().catch(() => this.redis.disconnect());
  }
}
