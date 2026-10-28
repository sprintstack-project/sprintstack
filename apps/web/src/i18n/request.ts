import { DEFAULT_LOCALE, MESSAGES } from '@sprintstack/shared/i18n';
import { getRequestConfig } from 'next-intl/server';

// English only for now. Choosing the locale from a cookie or Accept-Language would make every
// page dynamic (cacheComponents), so a second locale should arrive with a [locale] route segment.
export default getRequestConfig(async () => ({
  locale: DEFAULT_LOCALE,
  messages: MESSAGES[DEFAULT_LOCALE],
}));
