'use client';

import ProjectProvider from '@sprintstack/shared/providers/project';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useSyncExternalStore } from 'react';
import { PROJECT_COOKIE, PROJECT_COOKIE_MAX_AGE } from '@/lib/selected-project';

// The cookie as an external store. Same-tab writes notify through `listeners`; another tab's
// switch is picked up on this tab's next render or reload.
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const readCookie = () => {
  const prefix = `${PROJECT_COOKIE}=`;
  const entry = document.cookie.split('; ').find((part) => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
};

// The server reads the cookie itself (server/queries/projects.ts); while hydrating, the client
// starts from null and moves to the cookie's value straight after, without a mismatch.
const readServerSnapshot = () => null;

const writeCookie = (id: string) => {
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API isn't in every browser we support.
  document.cookie = `${PROJECT_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${PROJECT_COOKIE_MAX_AGE}; samesite=lax${secure}`;
  for (const listener of listeners) listener();
};

/**
 * The shared ProjectProvider, with the pick kept in the cookie the server also reads. A switch
 * re-renders the server components for the new project.
 */
const CookieProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const selectedId = useSyncExternalStore(subscribe, readCookie, readServerSnapshot);

  const onSelect = (id: string) => {
    writeCookie(id);
    router.refresh();
  };

  return <ProjectProvider selection={{ selectedId, onSelect }}>{children}</ProjectProvider>;
};

export default CookieProjectProvider;
