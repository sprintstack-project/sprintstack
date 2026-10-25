import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env';

/**
 * Typed GraphQL documents: results and variables are inferred from schema.graphql, which the API
 * writes in development. After an API schema change, run `yarn workspace @sprintstack/api-client
 * generate` (or let the gql.tada editor plugin do it).
 *
 *   const ViewerQuery = graphql(`query Viewer { viewer { id name } }`);
 */
export const graphql = initGraphQLTada<{
  introspection: typeof introspection;
  scalars: {
    DateTime: string;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
