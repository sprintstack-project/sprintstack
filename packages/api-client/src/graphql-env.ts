/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * You may import it to create a `graphql()` tag function with `gql.tada`
 * by importing it and passing it to `initGraphQLTada<>()`.
 *
 * @example
 * ```
 * import { initGraphQLTada } from 'gql.tada';
 * import type { introspection } from './introspection';
 *
 * export const graphql = initGraphQLTada<{
 *   introspection: typeof introspection;
 *   scalars: {
 *     DateTime: string;
 *     Json: any;
 *   };
 * }>();
 * ```
 */
const introspection = {
  __schema: {
    queryType: {
      name: 'Query',
    },
    mutationType: null,
    subscriptionType: null,
    types: [
      {
        kind: 'SCALAR',
        name: 'Boolean',
      },
      {
        kind: 'SCALAR',
        name: 'DateTime',
      },
      {
        kind: 'SCALAR',
        name: 'ID',
      },
      {
        kind: 'OBJECT',
        name: 'Query',
        fields: [
          {
            name: 'viewer',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'OBJECT',
                name: 'User',
              },
            },
            args: [],
            isDeprecated: false,
          },
        ],
        interfaces: [],
      },
      {
        kind: 'SCALAR',
        name: 'String',
      },
      {
        kind: 'OBJECT',
        name: 'User',
        fields: [
          {
            name: 'createdAt',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'DateTime',
              },
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'email',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'String',
              },
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'emailVerified',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Boolean',
              },
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'id',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'ID',
              },
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'image',
            type: {
              kind: 'SCALAR',
              name: 'String',
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'name',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'String',
              },
            },
            args: [],
            isDeprecated: false,
          },
          {
            name: 'twoFactorEnabled',
            type: {
              kind: 'NON_NULL',
              ofType: {
                kind: 'SCALAR',
                name: 'Boolean',
              },
            },
            args: [],
            isDeprecated: false,
          },
        ],
        interfaces: [],
      },
    ],
    directives: [],
  },
} as const;

export { introspection };
