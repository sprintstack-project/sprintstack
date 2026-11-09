import 'server-only';

import { MeQuery, UsersByProjectIdQuery } from '@sprintstack/api-client/documents/users';
import { cache } from 'react';
import { serverQuery } from '@/server/api';

/** The signed-in person. Deduped per request. */
export const getMe = cache(async () => (await serverQuery(MeQuery, {})).me);

export const getUsersByProjectId = cache(async (projectId: string, first = 8) => {
  const { usersByProject } = await serverQuery(UsersByProjectIdQuery, { projectId, first });
  return usersByProject;
});
