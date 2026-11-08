import { z } from 'zod';

// Keep in step with apps/api/src/users/users.schema.ts.
export const AVATAR_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
export type AvatarContentType = (typeof AVATAR_CONTENT_TYPES)[number];
export const AVATAR_MIN_SIZE = 256;
/** The storage limit for any upload (MAX_UPLOAD_BYTES in the API). */
export const AVATAR_MAX_BYTES = 3 * 1024 * 1024;

export const isAvatarContentType = (type: string | undefined): type is AvatarContentType =>
  AVATAR_CONTENT_TYPES.includes(type as AvatarContentType);

/** The profile page's form. Shared by web and native. */
export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80, 'Keep your name to 80 characters'),
  jobTitle: z.string().trim().max(80, 'Keep your job title to 80 characters'),
});

export type ProfileInput = z.input<typeof profileSchema>;
