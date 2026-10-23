import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the environment (e.g. Railway variables).
}

// The CLI (migrate, studio) selects the Postgres schema from the connection string,
// so append it here instead of requiring it in DATABASE_URL (Railway's URL has none).
function withSchema(url: string | undefined) {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.set('schema', process.env.DATABASE_SCHEMA ?? 'app');
  return parsed.toString();
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: withSchema(process.env.DATABASE_URL),
  },
});
