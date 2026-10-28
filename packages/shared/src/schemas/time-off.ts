import { z } from 'zod';
import { dateRange } from './date-range';

export const TIME_OFF_TYPES = ['vacation', 'sick', 'half', 'other'] as const;

export type TimeOffType = (typeof TIME_OFF_TYPES)[number];

/**
 * Adding or editing someone's time off. Working days (weekends, public holidays) depend on the
 * project's calendar, so that check lives with the calendar rather than here.
 */
export const timeOffSchema = z
  .object({
    member: z.string().min(1, 'Pick who’s off'),
    type: z.enum(TIME_OFF_TYPES),
    dates: dateRange('Pick the days off'),
  })
  .refine((value) => value.type !== 'half' || value.dates.start === value.dates.end, {
    path: ['dates'],
    message: 'A half day covers one day only',
  });

export type TimeOffInput = z.input<typeof timeOffSchema>;
export type NewTimeOff = z.output<typeof timeOffSchema>;
