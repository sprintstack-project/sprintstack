import { z } from 'zod';
import { email } from './auth';

/**
 * Roles someone can be invited with. Owner isn't one: the person who signs up owns the
 * organization, and ownership is handed over rather than invited.
 */
export const INVITE_ROLES = ['member', 'admin'] as const;
export type InviteRole = (typeof INVITE_ROLES)[number];

export const INVITE_ROLE_LABEL: Record<InviteRole, string> = {
  member: 'Member',
  admin: 'Admin',
};

/** Inviting someone to the active organization. Shared by the web and native forms. */
export const inviteSchema = z.object({
  email,
  role: z.enum(INVITE_ROLES),
});

export type InviteInput = z.input<typeof inviteSchema>;
