import { type ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlArgumentsHost, type GqlContextType } from '@nestjs/graphql';
import type { Request } from 'express';
import { GraphQLError } from 'graphql';
import { PostHogService } from './posthog.service';

/**
 * Reports unexpected errors from Nest routes and GraphQL resolvers to PostHog, then answers as Nest
 * would have. Expected ones aren't reported: HTTP exceptions under 500 and GraphQL errors thrown on
 * purpose (such as ClientThrottlerGuard's). Better Auth's /api/auth routes are Express middleware
 * outside Nest's filters.
 */
@Catch()
export class ErrorReportingFilter extends BaseExceptionFilter {
  constructor(private readonly postHog: PostHogService) {
    super();
  }

  override catch(exception: unknown, host: ArgumentsHost) {
    const graphql = host.getType<GqlContextType>() === 'graphql';
    const expected =
      (exception instanceof HttpException && exception.getStatus() < 500) ||
      exception instanceof GraphQLError;

    if (!expected && this.postHog.client) {
      // Where it happened, but not who: no user ID, bodies or query strings.
      if (graphql) {
        const gqlHost = GqlArgumentsHost.create(host);
        const { fieldName, operation } = gqlHost.getInfo();
        this.postHog.client.captureException(exception, undefined, {
          graphql_operation: operation.operation,
          graphql_field: fieldName,
        });
      } else {
        const req = host.switchToHttp().getRequest<Request>();
        this.postHog.client.captureException(exception, undefined, {
          method: req.method,
          route: req.route?.path ?? req.path,
        });
      }
    }

    // GraphQL turns a returned error into the response's errors entry.
    if (graphql) return exception;
    super.catch(exception, host);
  }
}
