import { join } from 'node:path';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createAuth } from './auth/auth';
import { ViewerResolver } from './auth/viewer.resolver';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
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
        // The AuthGuard reads the session from the request.
        context: ({ req }: { req: Request }) => ({ req }),
        // Blocks simple cross-site requests, which cookie auth would otherwise let through.
        csrfPrevention: true,
      }),
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, ViewerResolver],
})
export class AppModule {}
