import { z } from 'zod';
import { uuidSchema } from '../common.schema';

export const notificationIdsSchema = z.array(uuidSchema).max(100).nullish();

/** A Firebase Installation ID. */
export const fidSchema = z.string().trim().min(1).max(200);
