// Entry point for the Better Auth CLI only (`yarn workspace api auth:generate`), which reads the
// plugin list to write the auth models into prisma/schema.prisma. The app builds its own instance
// in AuthModule from PrismaService and ConfigService.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { createAuth } from './auth';

try {
  process.loadEnvFile();
} catch {
  // No .env file; rely on the environment.
}

// Schema generation never signs anything or builds URLs, so placeholders are enough.
const placeholders: Record<string, string> = {
  BETTER_AUTH_SECRET: 'schema-generation-only',
  BETTER_AUTH_URL: 'http://localhost:3001',
  TURNSTILE_SECRET: 'schema-generation-only',
};

export const auth = createAuth(
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }),
  }),
  (key) => process.env[key] ?? placeholders[key],
);
