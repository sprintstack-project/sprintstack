import type { Metadata } from 'next';
import { ContactLink, LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = { title: 'Privacy notice · SprintStack' };

const PrivacyPage = () => {
  return (
    <LegalPage eyebrow="Privacy notice" title="Your data, plainly.">
      <p>
        SprintStack is a personal portfolio project that demonstrates software engineering work. It
        is not a commercial service and is shared with a small number of invited people. This notice
        explains what personal data it handles, why, and what you can ask for. Questions go to{' '}
        <ContactLink />.
      </p>

      <h2>Who is responsible</h2>
      <p>
        The individual developer who built and runs SprintStack is the controller of your personal
        data. You can reach them at <ContactLink />.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> your name, email address and whether you’ve verified it.
        </li>
        <li>
          <strong>Password:</strong> stored only as a one-way hash, never in readable form.
        </li>
        <li>
          <strong>GitHub sign-in,</strong> if you use it: your GitHub account ID, name, email,
          profile picture and the access tokens GitHub issues for signing in.
        </li>
        <li>
          <strong>Passkeys and two-step sign-in,</strong> if you turn them on: each passkey’s public
          key and device type, your authenticator secret and your backup codes. Fingerprints and
          face data never leave your device.
        </li>
        <li>
          <strong>Sessions:</strong> the IP address and browser or device description of each
          signed-in session, and when it started.
        </li>
        <li>
          <strong>One-time codes</strong> we email you, kept until they’re used or expire after 10
          minutes.
        </li>
        <li>
          <strong>Anything you add</strong> to your workspace, such as issues, comments and project
          names.
        </li>
        <li>
          <strong>Technical data</strong> our hosting and security providers process to deliver and
          protect the site, such as IP addresses, request logs and browser signals used for the bot
          check.
        </li>
      </ul>
      <p>
        We don’t use analytics, advertising or tracking tools, and we never sell or rent your data.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>
          <strong>To run your account</strong> (signing you in, sending verification and
          password-reset emails, showing your work). This is needed to provide the service you asked
          for.
        </li>
        <li>
          <strong>To keep the service secure</strong> (bot checks, rate limits, spotting abuse and
          rejecting passwords that appear in known data breaches). This is our legitimate interest
          in protecting the service and its users.
        </li>
      </ul>

      <h2>Who we share it with</h2>
      <p>Only the providers needed to run SprintStack, each for its own part:</p>
      <ul>
        <li>
          <strong>Cloudflare:</strong> DNS, network protection and the Turnstile bot check on
          sign-up, sign-in and password-reset forms.
        </li>
        <li>
          <strong>Railway:</strong> hosting for the app, the API and the database.
        </li>
        <li>
          <strong>Mailjet:</strong> sending account emails.
        </li>
        <li>
          <strong>GitHub:</strong> only if you choose to sign in with it.
        </li>
        <li>
          <strong>Have I Been Pwned:</strong> receives the first five characters of a hash of a new
          password to check it against known breaches. It can’t work out your password or who you
          are from this.
        </li>
      </ul>
      <p>
        Some of these providers process data outside your country, including in the United States,
        under their own safeguards for international transfers. We may also disclose data where the
        law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Account data stays until you ask us to delete your account. Sessions expire after about a
        week without use, and one-time codes after 10 minutes. Because this is a demonstration
        project, all data may be deleted at any time without notice, including when the project
        shuts down.
      </p>

      <h2>Cookies</h2>
      <p>
        SprintStack uses only cookies it needs to work: a session cookie that keeps you signed in
        and short-lived cookies for sign-in steps. Cloudflare’s bot check may also use data stored
        in your browser for security. None of these are used for tracking or advertising, so there’s
        nothing to opt in to.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see, correct, export or delete your personal data, or object to how we use
        it. Email <ContactLink /> and we’ll respond within a month. If you’re in the EU, UK or
        another region with data protection laws, you can also complain to your local data
        protection authority.
      </p>

      <h2>Security</h2>
      <p>
        Passwords are hashed, connections are encrypted, and you can add a passkey or two-step
        sign-in. No system is completely secure, though, so don’t store anything sensitive or
        confidential in SprintStack.
      </p>

      <h2>Children</h2>
      <p>SprintStack isn’t meant for anyone under 16, and we don’t knowingly collect their data.</p>

      <h2>Changes</h2>
      <p>
        If this notice changes, we’ll update the date at the top. Continuing to use SprintStack
        after a change means you accept the updated notice.
      </p>
    </LegalPage>
  );
};

export default PrivacyPage;
