import { z } from 'zod';

/** A sprint's name, key (the prefix of its work item IDs, e.g. PAY-1482) and description. */
export const sprintDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Give the sprint a name').max(60, 'Keep it to 60 characters'),
  startDate: z.string().trim().min(1, 'Pick a start date'),
  endDate: z.string().trim().min(1, 'Pick an end date'),
});

export type SprintDetailsInput = z.input<typeof sprintDetailsSchema>;
