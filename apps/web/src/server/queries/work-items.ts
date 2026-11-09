import 'server-only';

import {
  WorkItemsByAssigneeQuery,
  WorkItemsByProjectIdQuery,
} from '@sprintstack/api-client/documents/work-items';
import { cache } from 'react';
import { serverQuery } from '@/server/api';

/** A project's work items assigned to the given user. Deduped per request. */
export const getWorkItemsByProjectId = cache(
  async (projectId: string, userId: string) =>
    (await serverQuery(WorkItemsByProjectIdQuery, { projectId, userId })).workItemsByProjectId,
);

export const getWorkItemsByAssignee = cache(
  async (projectId: string, userId: string) =>
    (await serverQuery(WorkItemsByAssigneeQuery, { projectId, userId })).workItemsByAssignee,
);
