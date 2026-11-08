import { z } from 'zod';

// Keep in step with packages/shared/src/schemas/profile.ts.
export const avatarContentTypeSchema = z.enum(['image/png', 'image/jpeg', 'image/webp']);
export const nameSchema = z.string().trim().min(1).max(80).nullish();
export const jobTitleSchema = z.string().trim().max(80).nullish();
