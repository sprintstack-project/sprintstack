import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { authClient, refreshSession } from '@/lib/auth-client';
import { restoreSignIn, shouldRestoreSignIn } from '@/lib/restore-key';

const IndexPage = () => {
  const { data: session, isPending } = authClient.useSession();
  // On a new Android phone, try the restore key before showing sign-in.
  const [restoring, setRestoring] = useState(shouldRestoreSignIn);

  useEffect(() => {
    if (isPending || session || !restoring) return;
    restoreSignIn().then(async (signedIn) => {
      if (signedIn) await refreshSession();
      setRestoring(false);
    });
  }, [isPending, session, restoring]);

  if (isPending || (restoring && !session)) return null;
  return <Redirect href={session ? '/main/dashboard' : '/sign-in'} />;
};

export default IndexPage;
