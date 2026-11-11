import { z } from 'zod';

import { Priority, WorkItemStatus, WorkItemType } from '../generated/prisma/enums';

/** A JSON-encoded string, parsed and then checked against `schema`. */
const jsonString = <T extends z.ZodType>(schema: T) =>
  z
    .string()
    .transform((value, ctx) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Must be valid JSON.' });
        return z.NEVER;
      }
    })
    .pipe(schema);

/** A Tiptap document; only the root is checked. */
const tiptapDoc = z.looseObject({ type: z.literal('doc') });

/** Given · When · Then. */
const criterion = z.object({ given: z.string(), when: z.string(), outcome: z.string() });

export const createWorkItemSchema = z
  .object({
    projectId: z.uuid(),
    type: z.enum(WorkItemType),
    title: z.string().trim().min(1, 'Title is required.'),
    description: jsonString(tiptapDoc).nullish(),
    criteria: jsonString(z.array(criterion)).nullish(),
    status: z.enum(WorkItemStatus).nullish(),
    atRisk: z.boolean().nullish(),
    priority: z.enum(Priority).nullish(),
    points: z.int().min(0, 'Points cannot be negative.').nullish(),
    tags: z.array(z.string().trim().min(1)).nullish(),
    startDate: z.date().nullish(),
    targetDate: z.date().nullish(),
    sprintId: z.uuid().nullish(),
    parentId: z.uuid().nullish(),
    assigneeId: z.string().min(1).nullish(),
  })
  .refine(({ startDate, targetDate }) => !startDate || !targetDate || startDate <= targetDate, {
    message: 'Start date must be on or before the target date.',
    path: ['targetDate'],
  });

/**
 * A partial update: a field left out stays as it is, and null clears a field that can be empty.
 * The start/target order is checked in the service, against whichever side wasn't sent.
 */
export const updateWorkItemSchema = z.object({
  id: z.uuid(),
  type: z.enum(WorkItemType).optional(),
  title: z.string().trim().min(1, 'Title is required.').optional(),
  description: jsonString(tiptapDoc).optional(),
  criteria: jsonString(z.array(criterion)).optional(),
  status: z.enum(WorkItemStatus).optional(),
  atRisk: z.boolean().optional(),
  priority: z.enum(Priority).optional(),
  points: z.int().min(0, 'Points cannot be negative.').nullish(),
  tags: z.array(z.string().trim().min(1)).optional(),
  startDate: z.date().nullish(),
  targetDate: z.date().nullish(),
  sprintId: z.uuid().nullish(),
  parentId: z.uuid().nullish(),
  assigneeId: z.string().min(1).nullish(),
});

export type CreateWorkItem = z.output<typeof createWorkItemSchema>;
export type UpdateWorkItem = z.output<typeof updateWorkItemSchema>;
