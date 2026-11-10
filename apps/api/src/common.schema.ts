import { z } from 'zod';

/**
 * App tables key on Postgres UUIDs; anything else would fail inside Prisma as a 500, not a 400.
 * Pair with @ValidateArgs on every ID arg that points at one of them.
 */
export const uuidSchema = z.uuid();

/** better-auth user ids are plain strings, not UUIDs. */
export const userIdSchema = z.string().min(1);
