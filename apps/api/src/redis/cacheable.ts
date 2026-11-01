import { Inject, Logger } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

/**
 * Method decorators that cache a service method's result in Redis. They inject the Redis client
 * themselves, so the service needs no Redis code:
 *
 *   @Cacheable({ key: (id: string) => `project:${id}`, ttl: 5 * 60_000 })
 *   findProject(id: string) { … }
 *
 *   @CacheEvict((id: string) => `project:${id}`)
 *   updateProject(id: string, data: ProjectUpdateInput) { … }
 *
 * Use them on service methods, not resolvers: resolver arguments (session, context) don't make
 * stable keys. Key anything per-user or per-org by that id. Values are stored as JSON, so cached
 * Dates come back as ISO strings (GraphQL's DateTime serializes either). Redis errors are logged
 * and the method runs uncached.
 */

const REDIS = Symbol('redis');

interface CacheTarget {
  [REDIS]: Redis;
}

type CacheKey<TArgs extends unknown[], TKey> = TKey | ((...args: TArgs) => TKey);

type AsyncMethod<TArgs extends unknown[], TResult> = TypedPropertyDescriptor<
  (...args: TArgs) => Promise<TResult>
>;

const logger = new Logger('Cacheable');

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

// Property-injects the client once per class, however many of its methods are decorated.
const injected = new WeakSet<object>();
const injectRedis = (target: object) => {
  if (injected.has(target)) return;
  injected.add(target);
  Inject(REDIS_CLIENT)(target, REDIS);
};

const resolveKey = <TArgs extends unknown[], TKey>(key: CacheKey<TArgs, TKey>, args: unknown[]) =>
  typeof key === 'function' ? (key as (...args: unknown[]) => TKey)(...args) : key;

/** Returns the cached result, or `{ hit: false }` on a miss or a Redis error. */
const read = async (redis: Redis, key: string) => {
  try {
    const value = await redis.get(key);
    return value === null ? { hit: false } : { hit: true, value: JSON.parse(value) as unknown };
  } catch (error) {
    logger.warn(`Read of ${key} failed: ${errorMessage(error)}`);
    return { hit: false };
  }
};

const write = async (redis: Redis, key: string, value: unknown, ttl: number) => {
  // JSON can't store undefined; the method runs again next time.
  if (value === undefined) return;
  try {
    await redis.set(key, JSON.stringify(value), 'PX', ttl);
  } catch (error) {
    logger.warn(`Write of ${key} failed: ${errorMessage(error)}`);
  }
};

/**
 * Caches the method's resolved value under `key` for `ttl` milliseconds. A key function receives
 * the method's arguments and is type-checked against its parameters.
 */
export const Cacheable =
  <TArgs extends unknown[]>({ key, ttl }: { key: CacheKey<TArgs, string>; ttl: number }) =>
  <TMethodArgs extends [...TArgs, ...unknown[]], TResult>(
    target: object,
    _property: string | symbol,
    descriptor: AsyncMethod<TMethodArgs, TResult>,
  ) => {
    injectRedis(target);
    const original = descriptor.value as (...args: TMethodArgs) => Promise<TResult>;
    // A function expression: the wrapper needs the service instance as `this`.
    descriptor.value = async function (this: CacheTarget, ...args: TMethodArgs) {
      const cacheKey = resolveKey(key, args);
      const cached = await read(this[REDIS], cacheKey);
      if (cached.hit) return cached.value as TResult;
      const result = await original.apply(this, args);
      await write(this[REDIS], cacheKey, result, ttl);
      return result;
    };
  };

/** Deletes `key` (one or several) once the method resolves, e.g. after an update or delete. */
export const CacheEvict =
  <TArgs extends unknown[]>(key: CacheKey<TArgs, string | string[]>) =>
  <TMethodArgs extends [...TArgs, ...unknown[]], TResult>(
    target: object,
    _property: string | symbol,
    descriptor: AsyncMethod<TMethodArgs, TResult>,
  ) => {
    injectRedis(target);
    const original = descriptor.value as (...args: TMethodArgs) => Promise<TResult>;
    descriptor.value = async function (this: CacheTarget, ...args: TMethodArgs) {
      const result = await original.apply(this, args);
      const keys = [resolveKey(key, args)].flat();
      try {
        await this[REDIS].del(...keys);
      } catch (error) {
        logger.warn(`Evict of ${keys.join(', ')} failed: ${errorMessage(error)}`);
      }
      return result;
    };
  };
