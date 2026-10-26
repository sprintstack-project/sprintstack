import type { Metadata } from 'next';
import { ContactLink, LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = { title: 'Terms of use · SprintStack' };

const TermsPage = () => {
  return (
    <LegalPage eyebrow="Terms of use" title="The ground rules.">
      <p>
        These terms apply whenever you use SprintStack. By creating an account or using the service,
        you agree to them. If you don’t agree, please don’t use SprintStack.
      </p>

      <h2>What SprintStack is</h2>
      <p>
        SprintStack is a personal portfolio project, built to demonstrate software engineering work.
        It is shared free of charge with a small number of invited people for evaluation. It is not
        a commercial product, comes with no support commitment, and isn’t meant for real work or
        real data.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be at least 16 years old.</li>
        <li>Give accurate details, and keep your password, passkeys and backup codes safe.</li>
        <li>
          You’re responsible for everything that happens under your account. Tell us at{' '}
          <ContactLink /> if you think someone else has access to it.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>break any law or anyone else’s rights while using SprintStack;</li>
        <li>
          probe, scan, attack or overload the service, or try to get around its security, bot checks
          or rate limits;
        </li>
        <li>use bots, scripts or other automated means to create accounts or send requests;</li>
        <li>
          use the service to send unwanted email, for example by entering other people’s addresses;
        </li>
        <li>access other people’s accounts or data, or impersonate anyone;</li>
        <li>
          upload malware, or content that is unlawful, harmful, or sensitive personal data about
          anyone;
        </li>
        <li>copy, resell or build a competing service from SprintStack.</li>
      </ul>

      <h2>Your content</h2>
      <p>
        You keep ownership of what you add. You allow us to store and display it only as needed to
        run the service for you. You’re solely responsible for your content and for having the right
        to add it.
      </p>

      <h2>Availability and data loss</h2>
      <p>
        SprintStack may be changed, interrupted, reset or shut down at any time, without notice.
        Data, including your account and everything in it, may be lost or deleted, and isn’t
        guaranteed to be backed up. Keep your own copy of anything you care about. Don’t rely on
        SprintStack for anything important.
      </p>

      <h2>No warranties</h2>
      <p>
        SprintStack is provided <strong>“as is” and “as available”</strong>, without warranties of
        any kind, whether express or implied. This includes any warranty that it is fit for a
        particular purpose, accurate, secure, error-free or always available.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, the developer of SprintStack isn’t liable for any loss
        or damage arising from your use of, or inability to use, the service. That includes:
      </p>
      <ul>
        <li>loss or corruption of data or content;</li>
        <li>
          misuse of the service by you or anyone else, including unauthorised access to your
          account;
        </li>
        <li>outages, errors, security incidents, or failures of third-party providers;</li>
        <li>any indirect, incidental, special or consequential loss, or lost profits.</li>
      </ul>
      <p>
        Because the service is free, any liability that can’t be excluded is limited to the amount
        you paid to use it, which is zero. Nothing in these terms limits liability that can’t be
        limited by law, such as for fraud, or for death or personal injury caused by negligence.
      </p>

      <h2>Indemnity</h2>
      <p>
        You agree to cover any claims, losses and costs, including reasonable legal fees, that arise
        because you broke these terms or misused SprintStack.
      </p>

      <h2>Suspension and ending</h2>
      <p>
        We may suspend or delete any account at any time, especially if it breaks these terms. You
        can stop using SprintStack at any time and ask us to delete your account at <ContactLink />.
        The sections on your content, data loss, warranties, liability and indemnity continue to
        apply after your access ends.
      </p>

      <h2>Other services</h2>
      <p>
        Signing in with GitHub and other connected services is governed by those services’ own
        terms. We aren’t responsible for them.
      </p>

      <h2>Privacy</h2>
      <p>
        The{' '}
        <a href="/privacy" className="link">
          privacy notice
        </a>{' '}
        explains how we handle personal data.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top shows the latest version. Continuing to use
        SprintStack after a change means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms go to <ContactLink />.
      </p>
    </LegalPage>
  );
};

export default TermsPage;
