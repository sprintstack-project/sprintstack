import { useMutation } from 'urql';
import { CreateWorkItemMutation, WorkItemsQuery } from './documents/work-items';
import useRootQuery from './useRootQuery';

export const useGetWorkItemsByProjectId = (projectId?: string) =>
  useRootQuery({
    query: WorkItemsQuery,
    variables: { projectId: projectId ?? '' },
    pause: !projectId,
  });

export const useCreateWorkItem = () => useMutation(CreateWorkItemMutation);
