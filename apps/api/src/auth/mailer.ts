import { Logger } from '@nestjs/common';

export interface AuthEmail {
  to: string;
  subject: string;
  text: string;
}

interface MailjetResponse {
  Messages?: { Status: string; Errors?: { ErrorMessage: string }[] }[];
  ErrorMessage?: string;
}

const MAILJET_SEND_URL = 'https://api.mailjet.com/v3.1/send';

const logger = new Logger('AuthMailer');

/**
 * Sends auth emails (sign-up codes, password-reset links) through Mailjet's Send API. Without
 * MAILJET_API_KEY/MAILJET_API_SECRET, development writes each email to the API log instead.
 * Not awaited by callers, so response times don't reveal whether an account exists; failures are
 * logged here rather than thrown.
 */
export const sendAuthEmail = async ({ to, subject, text }: AuthEmail) => {
  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;

  if (!apiKey || !apiSecret) {
    if (process.env.NODE_ENV === 'production') {
      logger.error(`Mailjet isn't configured; "${subject}" to ${to} was not sent`);
    } else {
      logger.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
    }
    return;
  }

  try {
    const response = await fetch(MAILJET_SEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: process.env.MAIL_FROM ?? 'no-reply@sprintstack.io',
              Name: process.env.MAIL_FROM_NAME ?? 'SprintStack',
            },
            To: [{ Email: to }],
            Subject: subject,
            TextPart: text,
          },
        ],
      }),
    });
    const result = (await response.json().catch(() => ({}))) as MailjetResponse;
    const message = result.Messages?.[0];
    if (!response.ok || message?.Status !== 'success') {
      const reason =
        message?.Errors?.map((error) => error.ErrorMessage).join('; ') ??
        result.ErrorMessage ??
        `HTTP ${response.status}`;
      logger.error(`Mailjet rejected "${subject}" to ${to}: ${reason}`);
    }
  } catch (error) {
    logger.error(`Couldn't reach Mailjet for "${subject}" to ${to}`, error);
  }
};
