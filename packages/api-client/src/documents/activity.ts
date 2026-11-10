import { graphql, type ResultOf } from '../graphql';

export const ActivityFields = graphql(`
    fragment ActivityFields on Activity @_unmask {
        action
        actor {
            id
            name
            image
        }
        createdAt
        data
        id
        projectId
        workItem {
            id
            key
            number
            title
        }
    }
`);

export type Activity = ResultOf<typeof ActivityFields>;

export const ActivitiesQuery = graphql(
  `
    query Activities($projectId: ID!, $first: Int!, $after: ID) {
        activityByProjectId(projectId: $projectId, first: $first, after: $after) {
            ...ActivityFields
        }
    }`,
  [ActivityFields],
);
