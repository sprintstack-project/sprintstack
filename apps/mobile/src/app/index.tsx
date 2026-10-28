import { Redirect } from 'expo-router';
import { authClient } from '@/lib/auth-client';

const IndexPage = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  return <Redirect href={session ? '/main/dashboard' : '/sign-in'} />;
};

export default IndexPage;
