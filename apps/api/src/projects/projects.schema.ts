import { z } from 'zod';

// Keep in step with packages/shared/src/schemas/project.ts.
export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(60),
  key: z
    .string()
    .trim()
    .regex(/^[A-Z][A-Z0-9]{1,4}$/),
  description: z
    .string()
    .trim()
    .max(500)
    .nullish()
    .transform((value) => value || null),
});

export type CreateProject = z.output<typeof createProjectSchema>;
