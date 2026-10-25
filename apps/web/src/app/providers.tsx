'use client';

import { ApiProvider, createApiClient } from '@sprintstack/api-client';
import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  // One client (and cache) per browser tab. /api/graphql is rewritten to the API, so the
  // first-party session cookie goes with every request.
  const [client] = useState(() =>
    createApiClient({
      url: '/api/graphql',
      serverRender: typeof window === 'undefined',
      onUnauthenticated: () => router.push('/signin'),
    }),
  );
  return <ApiProvider value={client}>{children}</ApiProvider>;
}
