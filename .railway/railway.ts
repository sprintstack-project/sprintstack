import {
  defineRailway,
  github,
  postgres,
  preserve,
  project,
  redis,
  service,
  volume,
} from 'railway/iac';

export default defineRailway(() => {
  const sprintstack = github('sprintstack-project/sprintstack', {
    branch: 'main',
    checkSuites: false,
  });

  const Postgres = postgres('Postgres', { region: 'europe-west4-drams3a' });
  Postgres.networking = { privateNetworkEndpoint: 'postgres' };
  const Redis = redis('Redis', { region: 'europe-west4-drams3a' });
  Redis.deploy = {
    startCommand:
      '/bin/sh -c "rm -rf $RAILWAY_VOLUME_MOUNT_PATH/lost+found/ && exec docker-entrypoint.sh redis-server --requirepass $REDIS_PASSWORD --save 60 1 --dir $RAILWAY_VOLUME_MOUNT_PATH"',
  };
  Redis.networking = { privateNetworkEndpoint: 'redis' };
  const redisVolume = volume('redis-volume', {
    alerts: { usage: { '100': {}, '80': {}, '95': {} } },
    allowOnlineResize: true,
    region: 'europe-west4-drams3a',
    sizeMB: 500,
  });
  const postgresVolume = volume('postgres-volume', {
    alerts: { usage: { '100': {}, '80': {}, '95': {} } },
    allowOnlineResize: true,
    region: 'europe-west4-drams3a',
    sizeMB: 500,
  });
  const api = service('api', {
    source: sprintstack,
    build: {
      buildCommand: 'yarn workspace api build',
      buildEnvironment: 'V3',
      builder: 'RAILPACK',
      watchPatterns: ['/apps/api/**', '/packages/shared/**', '/yarn.lock'],
    },
    deploy: {
      preDeployCommand: ['yarn workspace api db:migrate:deploy'],
      startCommand: 'yarn workspace api start:prod',
      healthcheckPath: '/health',
      healthcheckTimeout: 60,
      restartPolicyType: 'ON_FAILURE',
      restartPolicyMaxRetries: 5,
    },
    replicas: { 'europe-west4-drams3a': 1 },
    env: {
      APP_SCHEME: preserve(),
      BETTER_AUTH_SECRET: preserve(),
      BETTER_AUTH_URL: preserve(),
      DATABASE_POOL_MAX: preserve(),
      DATABASE_SCHEMA: preserve(),
      DATABASE_URL: Postgres.env.DATABASE_URL,
      FIREBASE_SERVICE_ACCOUNT: preserve(),
      FOUNDRY_OPENAI_API_KEY: preserve(),
      GITHUB_CLIENT_ID: preserve(),
      GITHUB_CLIENT_SECRET: preserve(),
      MAILJET_API_KEY: preserve(),
      MAILJET_API_SECRET: preserve(),
      MAIL_FROM: preserve(),
      MAIL_FROM_NAME: preserve(),
      PASSKEY_ORIGINS: preserve(),
      PORT: preserve(),
      POSTHOG_HOST: preserve(),
      POSTHOG_PROJECT_TOKEN: preserve(),
      REDIS_URL: Redis.env.REDIS_URL,
      TURNSTILE_SECRET: preserve(),
      WEB_ORIGIN: preserve(),
    },
  });
  const web = service('web', {
    source: sprintstack,
    build: {
      buildCommand: 'yarn workspace web build',
      buildEnvironment: 'V3',
      builder: 'RAILPACK',
      watchPatterns: ['/apps/web/**'],
    },
    start: 'yarn workspace web start',
    replicas: { 'europe-west4-drams3a': 1 },
    domains: [{ domain: 'sprintstack.io', port: 3001 }],
    env: {
      API_URL: preserve(),
      NEXT_PUBLIC_FIREBASE_API_KEY: preserve(),
      NEXT_PUBLIC_FIREBASE_APP_ID: preserve(),
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: preserve(),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: preserve(),
      NEXT_PUBLIC_FIREBASE_VAPID_KEY: preserve(),
      NEXT_PUBLIC_POSTHOG_HOST: preserve(),
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: preserve(),
    },
  });

  return project('sprintstack', {
    variables: { managed: true },
    resources: [Postgres, Redis, api, web, redisVolume, postgresVolume],
  });
});
