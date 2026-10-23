import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(config: ConfigService) {
    const schema = config.get<string>('DATABASE_SCHEMA') ?? 'app';
    super({
      adapter: new PrismaPg(
        {
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
          max: Number(config.get('DATABASE_POOL_MAX') ?? 10),
          // Unqualified table names in $queryRaw resolve to the same schema.
          options: `-c search_path=${schema}`,
        },
        { schema },
      ),
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
