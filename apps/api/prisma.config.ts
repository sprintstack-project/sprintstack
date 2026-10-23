import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the environment (e.g. Railway variables).
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
