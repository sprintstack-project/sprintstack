import { Logger } from '@nestjs/common';

export interface AuthEmail {
  to: string;
  subject: string;
  text: string;
}

const logger = new Logger('AuthMailer');

/**
 * Sends auth emails (sign-up codes, password-reset links). No provider is connected yet, so in
 * development each email is written to the API log; swap the body for your provider's SDK.
 * Not awaited by callers, so response times don't reveal whether an account exists.
 */
export const sendAuthEmail = async ({ to, subject, text }: AuthEmail) => {
  if (process.env.NODE_ENV === 'production') {
    logger.error(`No email provider configured; "${subject}" to ${to} was not sent`);
    return;
  }
  logger.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
};
