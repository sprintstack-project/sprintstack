import { Suspense } from 'react';
import { ResetPasswordForm } from './reset-password-form';

// The token arrives in the URL, which is only known at request time.
const ResetPasswordPage = () => {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
