import { z } from 'zod';

export const PROJECT_DESCRIPTION_MAX_LENGTH = 500;

/** A project's name, key (the prefix of its work item IDs, e.g. PAY-1482) and description. */
export const projectDetailsSchema = z.object({
  name: z.string().trim().min(1, 'Give the project a name').max(60, 'Keep it to 60 characters'),
  key: z
    .string()
    .trim()
    .regex(/^[A-Z][A-Z0-9]{1,4}$/, 'Use 2 to 5 capital letters or digits, starting with a letter'),
  description: z
    .string()
    .max(PROJECT_DESCRIPTION_MAX_LENGTH, `Keep it to ${PROJECT_DESCRIPTION_MAX_LENGTH} characters`),
});

export type ProjectDetailsInput = z.input<typeof projectDetailsSchema>;

export const SPRINT_LENGTH_MIN = 1;
export const SPRINT_LENGTH_MAX = 28;

/** Weekdays in the order the picker shows them, Monday first. */
export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/** How sprints are cut. Applies from the next sprint; the running one keeps its dates. */
export const sprintSettingsSchema = z.object({
  length: z
    .number({ error: `Pick ${SPRINT_LENGTH_MIN} to ${SPRINT_LENGTH_MAX} days` })
    .int('Use whole days')
    .min(SPRINT_LENGTH_MIN, `Pick ${SPRINT_LENGTH_MIN} to ${SPRINT_LENGTH_MAX} days`)
    .max(SPRINT_LENGTH_MAX, `Pick ${SPRINT_LENGTH_MIN} to ${SPRINT_LENGTH_MAX} days`),
  startDay: z.enum(WEEKDAYS),
  autoStart: z.boolean(),
  carryOver: z.boolean(),
});

export type SprintSettingsInput = z.input<typeof sprintSettingsSchema>;

export const PROJECT_ROLES = ['admin', 'product-owner', 'scrum-master', 'developer'] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];

export const PROJECT_ROLE_LABEL: Record<ProjectRole, string> = {
  admin: 'Admin',
  'product-owner': 'Product owner',
  'scrum-master': 'Scrum master',
  developer: 'Developer',
};

export const NOTIFICATION_EVENTS = [
  'created',
  'updated',
  'assigned',
  'mentioned',
  'sprint',
] as const;
export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[number];

export const NOTIFICATION_CHANNELS = ['email', 'in-app'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

const notificationRule = z.object({
  enabled: z.boolean(),
  roles: z.array(z.enum(PROJECT_ROLES)),
});

/**
 * Project-wide notification rules: who hears about each event, and whether by email as well as
 * in the app. Each person can still mute these in their own account.
 */
export const notificationSettingsSchema = z.object({
  channel: z.enum(NOTIFICATION_CHANNELS),
  rules: z.record(z.enum(NOTIFICATION_EVENTS), notificationRule),
});

export type NotificationSettingsInput = z.input<typeof notificationSettingsSchema>;
