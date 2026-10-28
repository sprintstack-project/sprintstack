import type { Locale, Messages } from '@sprintstack/shared/i18n';

// Types useTranslations() keys and ICU arguments against the English messages.
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
