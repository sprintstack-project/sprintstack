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

/** The project's active sprint (null when none). Waits (paused, no request) until there's a project. */
export const useGetCurrentSprint = (projectId: string | undefined) =>
  useRootQuery({
    query: CurrentSprintQuery,
    variables: { projectId: projectId ?? '' },
    pause: !projectId,
  });
