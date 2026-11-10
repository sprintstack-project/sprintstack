import { z } from 'zod';

export const sprintNameSchema = z.string().trim().min(1, 'Name is required.').max(60);
