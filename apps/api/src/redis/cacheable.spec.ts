import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Cacheable, CacheEvict } from './cacheable';
import { REDIS_CLIENT } from './redis.module';

const createFakeRedis = () => {
  const store = new Map<string, string>();
  return {
    store,
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (...keys: string[]) => keys.filter((key) => store.delete(key)).length),
  };
};

@Injectable()
class ProjectService {
  load = vi.fn(async (id: string) => ({ id, name: `Project ${id}` }));

  @Cacheable({ key: (id: string) => `project:${id}`, ttl: 60_000 })
  find(id: string) {
    return this.load(id);
  }

  @Cacheable({ key: 'projects:missing', ttl: 60_000 })
  async findMissing() {
    this.load('missing');
    return null;
  }

  @CacheEvict((id: string) => [`project:${id}`, 'projects:missing'])
  async rename(id: string, _name: string) {
    return id;
  }
}

describe('Cacheable', () => {
  let redis: ReturnType<typeof createFakeRedis>;
  let service: ProjectService;

  beforeEach(async () => {
    redis = createFakeRedis();
    const module = await Test.createTestingModule({
      providers: [ProjectService, { provide: REDIS_CLIENT, useValue: redis }],
    }).compile();
    service = module.get(ProjectService);
  });

  it('runs the method once and serves repeats from Redis', async () => {
    expect(await service.find('1')).toEqual({ id: '1', name: 'Project 1' });
    expect(await service.find('1')).toEqual({ id: '1', name: 'Project 1' });
    expect(service.load).toHaveBeenCalledTimes(1);
    expect(redis.set).toHaveBeenCalledWith('project:1', expect.any(String), 'PX', 60_000);
  });

  it('keys by the arguments', async () => {
    await service.find('1');
    await service.find('2');
    expect(service.load).toHaveBeenCalledTimes(2);
  });

  it('caches null results', async () => {
    expect(await service.findMissing()).toBeNull();
    expect(await service.findMissing()).toBeNull();
    expect(service.load).toHaveBeenCalledTimes(1);
  });

  it('evicts every key after the method resolves', async () => {
    await service.find('1');
    await service.findMissing();
    await service.rename('1', 'Renamed');
    expect(redis.store.size).toBe(0);
    await service.find('1');
    expect(service.load).toHaveBeenCalledTimes(3);
  });

  it('runs uncached when Redis fails', async () => {
    redis.get.mockRejectedValue(new Error('Connection is closed.'));
    redis.set.mockRejectedValue(new Error('Connection is closed.'));
    expect(await service.find('1')).toEqual({ id: '1', name: 'Project 1' });
    expect(await service.find('1')).toEqual({ id: '1', name: 'Project 1' });
    expect(service.load).toHaveBeenCalledTimes(2);
  });

  it('type-checks key functions against the method', () => {
    class Mismatched {
      // @ts-expect-error: the key takes a number, the method a string.
      @Cacheable({ key: (id: number) => `n:${id}`, ttl: 1 })
      async find(id: string) {
        return id;
      }
    }
    expect(Mismatched).toBeDefined();
  });
});
