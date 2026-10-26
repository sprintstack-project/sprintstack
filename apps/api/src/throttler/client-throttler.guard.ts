import { type ExecutionContext, Injectable } from '@nestjs/common';
import { type GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard, type ThrottlerLimitDetail } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { GraphQLError } from 'graphql';

/**
 * Rate limits Nest routes and GraphQL operations per client. Better Auth's /api/auth routes are
 * Express middleware outside Nest's guards, so they keep their own, stricter limiter (auth.ts).
 */
@Injectable()
export class ClientThrottlerGuard extends ThrottlerGuard {
  // The same client IP Better Auth uses: Cloudflare's cf-connecting-ip, which is only trustworthy
  // while the API is reachable solely through Cloudflare. Without it (Railway's health check, local
  // requests) the socket address is used, so those callers share one bucket.
  protected override async getTracker(req: Record<string, unknown>): Promise<string> {
    const { headers, ip } = req as unknown as Request;
    const clientIp = headers['cf-connecting-ip'];
    return typeof clientIp === 'string' && clientIp ? clientIp : (ip ?? 'unknown');
  }

  // GraphQL resolvers have no HTTP context of their own; app.module.ts puts req and res on theirs.
  protected override getRequestResponse(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      const { req, res } = GqlExecutionContext.create(context).getContext<{
        req: Request;
        res: Response;
      }>();
      return { req, res };
    }
    return super.getRequestResponse(context);
  }

  // GraphQL would report the HTTP exception as INTERNAL_SERVER_ERROR; say what happened instead.
  // The response stays 200 like any resolver error, so clients check the code, not the status.
  protected override async throwThrottlingException(
    context: ExecutionContext,
    detail: ThrottlerLimitDetail,
  ) {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return super.throwThrottlingException(context, detail);
    }
    throw new GraphQLError('Too many requests. Try again in a minute.', {
      extensions: { code: 'TOO_MANY_REQUESTS' },
    });
  }
}
