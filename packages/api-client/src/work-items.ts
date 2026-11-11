import { useMutation } from 'urql';
import {
  CreateWorkItemMutation,
  UpdateWorkItemMutation,
  WorkItemsByAssigneeQuery,
  WorkItemsByProjectIdQuery,
  WorkItemsBySprintIdQuery,
  WorkItemsInBacklogQuery,
} from './documents/work-items';
import useRootQuery from './useRootQuery';

export const useGetWorkItemsByProjectId = (projectId?: string) =>
  useRootQuery({
    query: WorkItemsByProjectIdQuery,
    variables: { projectId: projectId ?? '' },
    pause: !projectId,
  });

export const useGetWorkItemsBySprintId = (sprintId?: string) =>
  useRootQuery({
    query: WorkItemsBySprintIdQuery,
    variables: { sprintId: sprintId ?? '' },
    pause: !sprintId,
  });

export const useGetWorkItemsInBacklog = (projectId?: string) =>
  useRootQuery({
    query: WorkItemsInBacklogQuery,
    variables: { projectId: projectId ?? '' },
    pause: !projectId,
  });

export const useGetWorkItemsByAssignee = (userId?: string, projectId?: string) =>
  useRootQuery({
    query: WorkItemsByAssigneeQuery,
    variables: { userId: userId ?? '', projectId: projectId ?? '' },
    pause: !userId || !projectId,
  });

export const useCreateWorkItem = () => useMutation(CreateWorkItemMutation);

export const useUpdateWorkItem = () => useMutation(UpdateWorkItemMutation);
