'use client';

import type { Project } from '@sprintstack/api-client/documents/projects';
import { useProjects } from '@sprintstack/api-client/projects';
import { useRouter } from 'next/navigation';
import React, { useSyncExternalStore } from 'react';
import { PROJECT_COOKIE, PROJECT_COOKIE_MAX_AGE, pickProject } from '@/lib/selected-project';

type IProjectContext = {
  /** The viewer's projects; undefined while they load. */
  projects: Project[] | undefined;
  /** The selected project; undefined while loading or when the viewer has none. */
  project: Project | undefined;
  /** Shorthand for project?.id, for query variables. */
  projectId: string | undefined;
  /** Remembers the choice in the cookie and re-renders the server components for it. */
  setProjectId: (id: string) => void;
};

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

const ProjectContext = React.createContext<IProjectContext | undefined>(undefined);

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: projects } = useProjects();
  const selectedId = useSyncExternalStore(subscribe, readCookie, readServerSnapshot);
  const project = projects ? pickProject(projects, selectedId) : undefined;

  const setProjectId = (id: string) => {
    if (id === project?.id) return;
    writeCookie(id);
    // Server Components read the cookie, so re-render them for the new project.
    router.refresh();
  };

  const value: IProjectContext = { projects, project, projectId: project?.id, setProjectId };
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectProvider;
