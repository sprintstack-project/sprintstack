import { z } from 'zod';

/** A run of days, both ends included, as ISO dates. One day has start === end. */
export const dateRangeSchema = z
  .object({ start: z.iso.date(), end: z.iso.date() })
  // ISO dates sort as text.
  .refine((range) => range.start <= range.end, 'The last day can’t be before the first');

export type DateRange = z.infer<typeof dateRangeSchema>;

/** A range that starts empty (null) in a form and must be picked: null in, a range out. */
export const dateRange = (message: string) =>
  dateRangeSchema.nullable().transform((value, ctx) => {
    if (value === null) {
      ctx.addIssue({ code: 'custom', message });
      return z.NEVER;
    }
    return value;
  });
