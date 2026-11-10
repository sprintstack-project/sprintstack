import { z } from 'zod';

// Keep in step with WIDGET_KEYS in packages/shared/src/dashboard-widgets.ts.
const widgetKeySchema = z.enum(['next-items', 'activity', 'burndown', 'status']);

const preferenceFields = {
  widgets: z.array(widgetKeySchema).max(20).nullish(),
  theme: z.string().trim().min(1).max(20).nullish(),
};

/** userId and projectId on the input are ignored: the resolver takes them from the session and arg. */
export const createUserPreferenceSchema = z.looseObject(preferenceFields);

export const updateUserPreferenceSchema = z.object(preferenceFields);
