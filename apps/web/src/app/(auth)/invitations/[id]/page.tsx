import { Suspense } from 'react';
import { InvitationResponse } from './invitation-response';

// The invitation id arrives in the URL, which is only known at request time.
const InvitationPage = () => {
  return (
    <Suspense>
      <InvitationResponse />
    </Suspense>
  );
};

export default InvitationPage;
