import { join } from 'node:path';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createAuth } from './auth/auth';
import { ViewerResolver } from './auth/viewer.resolver';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { RobotsController } from './robots/robots.controller';
import { ClientThrottlerGuard } from './throttler/client-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // A backstop behind Cloudflare: 60 requests a minute per client IP on each route and GraphQL
    // operation. Generous for people, tight enough that one client can't flood the API or database.
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 60 }] }),
    // Mounts Better Auth at /api/auth and registers a global AuthGuard: routes and resolvers need
    // a session unless they're marked @AllowAnonymous() or @OptionalAuth().
    AuthModule.forRootAsync({
      inject: [PrismaService, ConfigService],
      useFactory: (prisma: PrismaService, config: ConfigService) => ({
        auth: createAuth(prisma, (key) => config.get<string>(key)),
      }),
    }),
    // Code-first: the schema is generated from the resolvers. In development it's written to
    // packages/api-client, which types the web and mobile queries from it (gql.tada).
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile:
          config.get('NODE_ENV') === 'production'
            ? true
            : join(process.cwd(), '../../packages/api-client/schema.graphql'),
        sortSchema: true,
        // The AuthGuard reads the session from the request; ClientThrottlerGuard also sets headers.
        context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
        // Blocks simple cross-site requests, which cookie auth would otherwise let through.
        csrfPrevention: true,
      }),
    }),
  ],
  controllers: [AppController, HealthController, RobotsController],
  providers: [AppService, ViewerResolver, { provide: APP_GUARD, useClass: ClientThrottlerGuard }],
})
export class AppModule {}
