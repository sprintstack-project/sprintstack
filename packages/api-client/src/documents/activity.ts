import { graphql, type ResultOf } from '../graphql';

export const ActivityFields = graphql(`
    fragment ActivityFields on Activity @_unmask {
        endDate
        goal
        id
        name
        startDate
        state
    }
`);

export type Activity = ResultOf<typeof ActivityFields>;

export const ActivitiesQuery = graphql(
  `
    query Activities($projectId: ID!, $first: Int, $after: Int) {
        activities(projectId: $projectId, first: $first, after: $after) {
            ...ActivityFields
        }
    }`,
  [ActivityFields],
);
