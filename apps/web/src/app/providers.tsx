'use client';

import { createApiClient } from '@sprintstack/api-client/client';
import { type ReactNode, useState } from 'react';
import { Provider as ApiProvider } from 'urql';

export const Providers = ({ children }: { children: ReactNode }) => {
  // One client (and cache) per browser tab. /api/graphql is rewritten to the API, so the
  // first-party session cookie goes with every request.
  const [client] = useState(() =>
    createApiClient({
      url: '/api/graphql',
      serverRender: typeof window === 'undefined',
      // A full load, not router.push: it drops the cache, so the next person to sign in on this
      // tab can't see the last one's data.
      onUnauthenticated: () => window.location.assign('/signin'),
    }),
  );
  return <ApiProvider value={client}>{children}</ApiProvider>;
};
