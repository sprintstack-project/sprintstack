import { defineRailway, postgres, preserve, project, redis, service } from 'railway/iac';

// Manages only the resources declared here, so services added elsewhere in the project are left
// alone. `railway config plan` previews changes; `railway config apply` applies them.
export const partial = 'api';

export default defineRailway(() => {
  const db = postgres('Postgres');
  const cache = redis('Redis');

  // The NestJS API. It builds from the repo root so yarn can resolve the workspace packages.
  const api = service('api', {
    build: {
      builder: 'RAILPACK',
      buildCommand: 'yarn workspace api build',
      watchPatterns: ['apps/api/**', 'packages/shared/**', 'yarn.lock'],
    },
    deploy: {
      preDeployCommand: ['yarn workspace api db:migrate:deploy'],
      startCommand: 'yarn workspace api start:prod',
      healthcheckPath: '/health',
      healthcheckTimeout: 60,
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 5,
    },
    env: {
      DATABASE_URL: db.env.DATABASE_URL,
      REDIS_URL: cache.env.REDIS_URL,
      // Secrets stay out of the repo: keep whatever is set in Railway.
      FOUNDRY_OPENAI_API_KEY: preserve(),
      MAILJET_API_KEY: preserve(),
      MAILJET_API_SECRET: preserve(),
      MAIL_FROM: preserve(),
      MAIL_FROM_NAME: preserve(),
    },
  });

  return project('sprintstack', { resources: [api, db, cache] });
});
