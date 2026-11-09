import type { Metadata } from 'next';
import { ContactLink, LegalPage } from '@/components/legal/legal-page';

export const metadata: Metadata = { title: 'Imprint · SprintStack' };

// TODO: replace with the operator's legal name and a postal address they can be served at.
const OPERATOR_NAME = 'Shantanu Paul';
const OPERATOR_ADDRESS = ['Parkstr. 14', '13585 Berlin', 'Germany'];

const ImprintPage = () => {
  return (
    <LegalPage eyebrow="Imprint" title="Who runs this.">
      <p>
        SprintStack is a personal portfolio project that demonstrates software engineering work. It
        is not a commercial service.
      </p>

      <h2>Operator and person responsible for content</h2>
      <p>
        {OPERATOR_NAME}
        {OPERATOR_ADDRESS.map((line) => (
          <span key={line}>
            <br />
            {line}
          </span>
        ))}
      </p>

      <h2>Contact</h2>
      <p>
        Email: <ContactLink />
      </p>
    </LegalPage>
  );
};

export default ImprintPage;
