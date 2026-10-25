import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_STRENGTH_LABEL,
  passwordStrength,
} from '@sprintstack/shared';
import { Check, Minus } from 'lucide-react';

/**
 * Live feedback under a new password: four bars, a word for the strength (status as words, not
 * colour), and the rules. The leaked-password check runs on the API when the form is sent.
 */
export const PasswordMeter = ({ password }: { password: string }) => {
  const strength = passwordStrength(password);
  const longEnough = password.length >= PASSWORD_MIN_LENGTH;
  const rules = [
    { met: longEnough, text: `At least ${PASSWORD_MIN_LENGTH} characters` },
    { met: false, text: 'Not a known leaked password (checked when you continue)' },
    { met: strength === 4, text: 'Longer is stronger: try a passphrase' },
  ];

  return (
    <div className="flex flex-col gap-2.5" aria-live="polite">
      <div className="flex items-center gap-3">
        <div aria-hidden className="grid flex-1 grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={`h-1.5 rounded-full ${bar <= strength ? 'bg-brand-ink' : 'bg-line'}`}
            />
          ))}
        </div>
        <span className="headline text-[0.875rem] leading-none">
          Strength: {password ? PASSWORD_STRENGTH_LABEL[strength].toLowerCase() : 'none yet'}
        </span>
      </div>
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-x-4 gap-y-1.5 p-0 text-meta font-semibold text-ink-muted">
        {rules.map((rule) => (
          <li key={rule.text} className={`flex items-center gap-1.5 ${rule.met ? 'text-ink' : ''}`}>
            {rule.met ? (
              <Check aria-hidden strokeWidth={2.5} className="size-4 shrink-0 text-success" />
            ) : (
              <Minus aria-hidden strokeWidth={2.5} className="size-4 shrink-0" />
            )}
            <span>
              {rule.text}
              {rule.met && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
