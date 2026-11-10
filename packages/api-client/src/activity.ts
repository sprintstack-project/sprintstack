import { ActivitiesQuery } from './documents/activity';
import useRootQuery from './useRootQuery';

/** A project's recent activity, newest first. `after` is the last activity id of the previous page. */
export const useGetAllActivities = (projectId?: string, first = 10, after?: string) =>
  useRootQuery({
    query: ActivitiesQuery,
    variables: { projectId: projectId ?? '', first, after },
    pause: !projectId,
  });
