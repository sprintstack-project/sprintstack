import { authClient } from '@/lib/auth-client';

/** The viewer's first name, from the session the main layout has already loaded. */
const FirstName = () => {
  const { data: session } = authClient.useSession();
  return session?.user?.name?.split(' ')?.[0];
};

export default FirstName;
