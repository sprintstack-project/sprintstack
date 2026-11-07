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

export const MeQuery = graphql(
  `
  query Me {
    me {
    ...UserFields
    }
  }
`,
  [UserFields],
);

export type UserSummary = ResultOf<typeof UsersQuery>['users'][number];
