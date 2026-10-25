import { cacheExchange, type UpdateResolver } from '@urql/exchange-graphcache';
import { introspection } from './graphql-env';

/**
 * Refetches every cached variant of a list field (each project, filter and page), like RTK
 * Query's invalidatesTags. Use it for mutations that add or remove items:
 *
 *   updates: { Mutation: { createIssue: refetchList('issues') } }
 */
export const refetchList =
  (field: string): UpdateResolver =>
  (_result, _args, cache) => {
    for (const { fieldName, fieldKey } of cache.inspectFields('Query')) {
      if (fieldName === field) cache.invalidate('Query', fieldKey);
    }
  };

/** Removes a deleted entity everywhere it's shown. For mutations that take its `id`. */
export const removeEntity =
  (typename: string): UpdateResolver =>
  (_result, args, cache) => {
    cache.invalidate({ __typename: typename, id: args.id as string });
  };

/**
 * The normalized cache shared by web and mobile. Each entity is stored once by __typename + id,
 * so a mutation that returns the changed entity updates every query showing it without a refetch.
 * Only adds and removes need an entry in `updates`.
 */
export const createCache = () =>
  cacheExchange({
    schema: introspection,
    // Types without an `id` field need a key here (or `() => null` to embed them in their parent).
    keys: {},
    updates: {
      Mutation: {},
    },
  });
