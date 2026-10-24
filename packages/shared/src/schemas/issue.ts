import { z } from 'zod';
import { richTextRequired } from './rich-text';

export const ISSUE_TYPES = ['bug', 'story', 'task'] as const;
export const ISSUE_PRIORITIES = ['highest', 'high', 'medium', 'low', 'lowest'] as const;

/** A choice that starts empty (null) in a form and must be made: null in, a real value out. */
const choice = <const T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z
    .enum(values)
    .nullable()
    .transform((value, ctx) => {
      if (value === null) {
        ctx.addIssue({ code: 'custom', message });
        return z.NEVER;
      }
      return value;
    });

/**
 * Creating or editing an issue. Shared by the forms (web and native) and the API, so the two
 * validate the same rules. Messages say what to do, per the design system's content rules.
 */
export const issueSchema = z.object({
  summary: z
    .string()
    .trim()
    .min(1, 'Enter a summary')
    .max(120, 'Keep the summary to 120 characters or fewer'),
  type: choice(ISSUE_TYPES, 'Choose an issue type'),
  priority: choice(ISSUE_PRIORITIES, 'Choose a priority'),
  description: richTextRequired('Describe the issue'),
  points: z
    .number()
    .int('Use whole story points')
    .min(0)
    .max(21, 'Story points go up to 21')
    .nullable(),
  labels: z.array(z.string()).max(5, 'Use at most 5 labels'),
  dueDate: z.iso.date('Pick a due date').nullable(),
});

export type IssueInput = z.input<typeof issueSchema>;
export type Issue = z.output<typeof issueSchema>;
