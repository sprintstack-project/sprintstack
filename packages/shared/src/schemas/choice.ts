import { z } from 'zod';

/** A choice that starts empty (null) in a form and must be made: null in, a real value out. */
export const choice = <const T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) =>
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
