# @sprintstack/api-client

The GraphQL client for web and mobile: urql with a normalized Graphcache cache and gql.tada types.

- `schema.graphql` is written by the API in development (`yarn workspace api start:dev`).
- After a schema change, run `yarn workspace @sprintstack/api-client generate` to refresh `src/graphql-env.ts`.
- Edits update every query by themselves. Mutations that add or remove items get an entry in
  `updates.Mutation` in `src/cache.ts` (`refetchList`, `removeEntity`).
