import en from './messages/en.json';

export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

// English is the source of truth: every other locale's file must have the same keys (ICU syntax).
export type Messages = typeof en;
export const MESSAGES: Record<Locale, Messages> = { en };
