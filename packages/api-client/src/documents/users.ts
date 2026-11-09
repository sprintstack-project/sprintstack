// User documents, apart from the hooks so Server Components can import them.
import { graphql, type ResultOf } from '../graphql';

export const UserFields = graphql(`
    fragment UserFields on UserSummary @_unmask {
        id
        name
        email
        image
    }
`);

export const UsersQuery = graphql(
  `
  query Users($search: String, $first: Int!) {
    users(search: $search, first: $first) {
    ...UserFields
    }
  }
`,
  [UserFields],
);

export const UsersByProjectIdQuery = graphql(`query UsersByProject($projectId: ID!, $first: Int!) {
    usersByProject(projectId: $projectId, first: $first) {
        email
        id
        image
        name
    }
  }
`);

export const MeFields = graphql(`
    fragment MeFields on Me @_unmask {
        id
        name
        email
        image
        emailVerified
        jobTitle
    }
`);

export const MeQuery = graphql(
  `
  query Me {
    me {
    ...MeFields
    }
  }
`,
  [MeFields],
);

export const UpdateMeMutation = graphql(
  `
  mutation UpdateMe($name: String, $jobTitle: String, $image: String) {
    updateMe(name: $name, jobTitle: $jobTitle, image: $image) {
    ...MeFields
    }
  }
`,
  [MeFields],
);

export const CreateAvatarUploadMutation = graphql(`
  mutation CreateAvatarUpload($contentType: String!) {
    createAvatarUpload(contentType: $contentType) {
      key
      url
      fields {
        name
        value
      }
    }
  }
`);

export const UserPreferencesQuery = graphql(`query GetUserPreferences($projectId: ID!) {
    getUserPreferences(projectId: $projectId) {
        createdAt
        theme
        updatedAt
        userId
        widgets
    }
}`);

export const UpdateUserPreferencesMutation =
  graphql(`mutation UpdateUserPreferences($projectId: ID!, $widgets: [String!], $theme: String) {
    updateUserPreferences(data: { widgets: $widgets, theme: $theme }, projectId: $projectId) {
        createdAt
        id
        theme
        updatedAt
        userId
        widgets
    }
}`);

export type User = ResultOf<typeof UsersQuery>['users'][number];
