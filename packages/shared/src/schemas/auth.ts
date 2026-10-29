import { z } from 'zod';

// Keep in step with emailAndPassword in apps/api/src/auth/auth.ts.
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const CODE_LENGTH = 6;

export const email = z
  .string()
  .trim()
  .min(1, 'Enter your email')
  .pipe(z.email('Enter a valid email'));

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters`);

/** Signing in with email and password. Shared by the web and native forms. */
export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
  rememberMe: z.boolean(),
});

/** Signing up creates an organization too, with the new account as its owner. */
export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(80, 'Keep your name to 80 characters'),
  email,
  organization: z
    .string()
    .trim()
    .min(1, 'Enter your organization’s name')
    .max(80, 'Keep the name to 80 characters'),
  password: newPassword,
  terms: z.boolean().refine(Boolean, 'Agree to the Terms and Privacy notice to continue'),
});

/**
 * Signing up from an invite: the person joins that organization instead of creating one, so the
 * name isn't checked. The field stays in the shape so both schemas validate the same form.
 */
export const invitedSignUpSchema = signUpSchema.extend({ organization: z.string() });

/**
 * "Acme & Co." → "acme-co", the organization's unique URL name. With `suffix`, adds a few random
 * characters for when the plain one is taken.
 */
export const organizationSlug = (name: string, suffix = false) => {
  const base =
    name
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40)
      .replace(/-+$/, '') || 'org';
  return suffix ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;
};

/** A code from an authenticator app or a verification email. */
export const codeSchema = z.object({
  code: z.string().regex(new RegExp(`^\\d{${CODE_LENGTH}}$`), `Enter all ${CODE_LENGTH} digits`),
});

/** A one-time recovery code, shown when the authenticator was set up. */
export const recoveryCodeSchema = z.object({
  code: z.string().trim().min(1, 'Enter one of your recovery codes'),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z.object({ password: newPassword });

export type SignInInput = z.input<typeof signInSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;

/** The sign-up flow, shown by the Stepper on web and mobile. */
export const SIGN_UP_STEPS = ['Account', 'Verify', 'Secure'];
