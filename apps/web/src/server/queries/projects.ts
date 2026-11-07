import 'server-only';

import { ProjectsQuery } from '@sprintstack/api-client/documents/projects';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { PROJECT_COOKIE, pickProject } from '@/lib/selected-project';
import { serverQuery } from '@/server/api';

/** The viewer's projects in their active organization. Deduped per request. */
export const getProjects = cache(async () => (await serverQuery(ProjectsQuery, {})).projects);

/**
 * The project picked in the sidebar (its cookie), checked against the viewer's projects. Null when
 * they have none. Deduped per request.
 */
export const getSelectedProject = cache(async () => {
  const [projects, store] = await Promise.all([getProjects(), cookies()]);
  return pickProject(projects, store.get(PROJECT_COOKIE)?.value) ?? null;
});
