import { z } from 'zod';
import { choice } from './choice';
import { ISSUE_PRIORITIES, ISSUE_TYPES } from './issue';
import { richTextDoc } from './rich-text';

export const WORK_ITEM_STATUSES = ['todo', 'in_progress', 'in_review', 'blocked', 'done'] as const;

/** How a linked item relates to this one. Links show on both items, read from each side. */
export const WORK_ITEM_LINK_KINDS = [
  'parent',
  'child',
  'related',
  'preceded_by',
  'succeeded_by',
  'caused_by',
] as const;

/** The quick picks for story points; the rest of the scale sits behind "More". */
export const STORY_POINTS = [1, 2, 3, 5, 8, 13] as const;
export const MORE_STORY_POINTS = [0, 21, 34] as const;

/** One acceptance criterion, written as Given · When · Then. */
export const criterionSchema = z.object({
  given: z.string().trim().min(1, 'Say what’s true to begin with'),
  when: z.string().trim().min(1, 'Say what the person does'),
  /** The "Then" part. */
  outcome: z.string().trim().min(1, 'Say what should happen'),
});

export const workItemLinkSchema = z.object({
  kind: z.enum(WORK_ITEM_LINK_KINDS),
  /** The linked item's key, e.g. "PAY-1486". */
  key: z.string().min(1),
});

/**
 * Creating a work item. Shared by the forms (web and native) and the API, so the two validate the
 * same rules. Only the title and type must be filled in; everything else has a default or can wait.
 */
export const workItemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Add a title. It’s what people scan on the board.')
      .max(120, 'Keep the title to 120 characters or fewer'),
    type: choice(ISSUE_TYPES, 'Pick a type to continue'),
    status: z.enum(WORK_ITEM_STATUSES),
    sprint: z.string().nullable(),
    priority: z.enum(ISSUE_PRIORITIES),
    assignee: z.string().nullable(),
    start: z.iso.date('Pick a start date').nullable(),
    target: z.iso.date('Pick a target date').nullable(),
    points: z
      .number()
      .int('Use whole story points')
      .min(0)
      .max(34, 'Story points go up to 34. Split anything bigger.')
      .nullable(),
    tags: z.array(z.string().trim().min(1)).max(10, 'Use at most 10 tags'),
    description: richTextDoc,
    criteria: z.array(criterionSchema),
    links: z.array(workItemLinkSchema),
    /** Ids of uploaded files. */
    attachments: z.array(z.string()),
  })
  .refine(({ start, target }) => !start || !target || target >= start, {
    path: ['target'],
    message: 'Set a target on or after the start',
    // Check the dates even while other fields are still invalid, so the error shows as they're picked.
    when: ({ value }) => {
      const { start, target } = value as { start?: unknown; target?: unknown };
      return typeof start === 'string' && typeof target === 'string';
    },
  });

export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[number];
export type WorkItemLinkKind = (typeof WORK_ITEM_LINK_KINDS)[number];
export type Criterion = z.infer<typeof criterionSchema>;
export type WorkItemLink = z.infer<typeof workItemLinkSchema>;
export type WorkItemInput = z.input<typeof workItemSchema>;
export type NewWorkItem = z.output<typeof workItemSchema>;
