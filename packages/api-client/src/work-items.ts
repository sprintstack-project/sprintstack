import { useMutation } from 'urql';
import {
  CreateWorkItemMutation,
  WorkItemsByAssigneeQuery,
  WorkItemsByProjectIdQuery,
} from './documents/work-items';
import useRootQuery from './useRootQuery';

export const useGetWorkItemsByProjectId = (projectId?: string) =>
  useRootQuery({
    query: WorkItemsByProjectIdQuery,
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
