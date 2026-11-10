import { graphql, type ResultOf } from '../graphql';

export const ProjectSettingsFields = graphql(`
    fragment ProjectSettingsFields on ProjectSettings @_unmask {
        carryOverIncompleteWork
        createdAt
        id
        projectId
        sprintDuration
        sprintStartsOn
        startSprintAutomatically
        updatedAt
    }
`);

export const ProjectSettingsQuery = graphql(
  `query GetProjectSettings($projectId: ID!) {
    getProjectSettings(projectId: $projectId) {
        ...ProjectSettingsFields
    }
}`,
  [ProjectSettingsFields],
);

export type ProjectSettings = ResultOf<typeof ProjectSettingsQuery>['getProjectSettings'];
