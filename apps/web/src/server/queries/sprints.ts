import 'server-only';

import { CurrentSprintQuery } from '@sprintstack/api-client/documents/sprints';
import { cache } from 'react';
import { serverQuery } from '@/server/api';

/** The project's active sprint, or null when none is running. Deduped per request. */
export const getCurrentSprint = cache(
  async (projectId: string) => (await serverQuery(CurrentSprintQuery, { projectId })).currentSprint,
);
