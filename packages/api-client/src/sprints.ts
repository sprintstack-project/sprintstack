import { CurrentSprintQuery, SprintByIdQuery, SprintsQuery } from './documents/sprints';
import useRootQuery from './useRootQuery';

export const useGetAllSprints = (projectId: string) =>
  useRootQuery({
    query: SprintsQuery,
    variables: { projectId },
  });

export const useGetSprintById = (id: string) =>
  useRootQuery({
    query: SprintByIdQuery,
    variables: { id },
  });

export const useGetCurrentSprint = (projectId: string) =>
  useRootQuery({
    query: CurrentSprintQuery,
    variables: { projectId },
  });
