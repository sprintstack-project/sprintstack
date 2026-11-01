import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

/**
 * PostHog error tracking: what ErrorReportingFilter reports, plus uncaught exceptions and unhandled
 * rejections outside requests. Without POSTHOG_PROJECT_TOKEN and POSTHOG_HOST the client is null
 * and nothing is reported.
 */
@Injectable()
export class PostHogService implements OnApplicationShutdown {
  readonly client: PostHog | null;

  constructor(config: ConfigService) {
    const projectToken = config.get<string>('POSTHOG_PROJECT_TOKEN');
    const host = config.get<string>('POSTHOG_HOST');
    this.client =
      projectToken && host
        ? new PostHog(projectToken, { host, enableExceptionAutocapture: true })
        : null;
  }

  // Sends what's still queued before the process exits (main.ts enables shutdown hooks).
  async onApplicationShutdown() {
    await this.client?.shutdown();
  }
}
