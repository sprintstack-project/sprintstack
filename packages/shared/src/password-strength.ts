import { PASSWORD_MIN_LENGTH } from './schemas/auth';

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const PASSWORD_STRENGTH_LABEL: Record<PasswordStrength, string> = {
  0: 'Too short',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

/**
 * A rough guide for the sign-up meter, not a rule: length counts most, then mixing kinds of
 * characters. The API enforces the minimum length and rejects known leaked passwords.
 */
export const passwordStrength = (password: string): PasswordStrength => {
  if (password.length < PASSWORD_MIN_LENGTH) return 0;
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length;
  let score = 1;
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;
  if (kinds >= 3) score++;
  return Math.min(score, 4) as PasswordStrength;
};
