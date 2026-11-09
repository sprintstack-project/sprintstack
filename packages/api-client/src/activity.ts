import { ActivitiesQuery } from './documents/activity';
import useRootQuery from './useRootQuery';

export const useGetAllActivities = (projectId?: string, first: number = 10, after: number = 50) =>
  useRootQuery({
    query: ActivitiesQuery,
    variables: { projectId: projectId ?? '', first, after },
    pause: !projectId,
  });
