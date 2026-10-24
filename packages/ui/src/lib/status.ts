import type { Priority, StatusTone } from '@ui/types';

/** The word each status badge shows by default. Badges are always words, never a bare colour. */
export const STATUS_LABEL: Record<StatusTone, string> = {
  neutral: 'To do',
  info: 'In progress',
  review: 'In review',
  success: 'Done',
  danger: 'Blocked',
  warning: 'At risk',
};

/** Badge fill and text per tone; the same classes work on web and native (Uniwind). */
export const STATUS_CLASSES: Record<StatusTone, { box: string; text: string }> = {
  neutral: { box: 'bg-neutral-subtle', text: 'text-ink-muted' },
  info: { box: 'bg-info-subtle', text: 'text-info-ink' },
  review: { box: 'bg-review-subtle', text: 'text-review-ink' },
  success: { box: 'bg-success-subtle', text: 'text-success-ink' },
  danger: { box: 'bg-danger', text: 'text-on-danger' },
  warning: { box: 'bg-warning-subtle', text: 'text-warning-ink' },
};

export const STATUS_TONES = Object.keys(STATUS_LABEL) as StatusTone[];

export const isStatusTone = (tone: unknown): tone is StatusTone =>
  STATUS_TONES.includes(tone as StatusTone);

export const PRIORITY_LABEL: Record<Priority, string> = {
  highest: 'Highest',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  lowest: 'Lowest',
};

export const PRIORITY_DIRECTION: Record<Priority, 'up' | 'flat' | 'down'> = {
  highest: 'up',
  high: 'up',
  medium: 'flat',
  low: 'down',
  lowest: 'down',
};

/** Pill avatars take initials ("SP") or an image URL. */
export const isImageUrl = (avatar: string) => /^(https?:|data:|\/)/.test(avatar);
