import {
  cacheExchange,
  type OptimisticMutationResolver,
  type UpdateResolver,
} from '@urql/exchange-graphcache';
import { WorkItemFields } from './documents/work-items';
import { graphql } from './graphql';
import { introspection } from './graphql-env';

const ReadAtFragment = graphql(`
  fragment ReadAt on Notification {
    id
    readAt
  }
`);

/**
 * markNotificationsRead only returns a count, so mark the cached notifications read here (the ids
 * given, or every one) and refetch the unread count.
 */
const markNotificationsRead: UpdateResolver = (_result, args, cache) => {
  const ids = args.ids as string[] | null | undefined;
  const readAt = new Date().toISOString();
  for (const { fieldName, fieldKey } of cache.inspectFields('Query')) {
    if (fieldName !== 'notifications') continue;
    const keys = (cache.resolve('Query', fieldKey) as string[] | null) ?? [];
    for (const key of keys) {
      const id = cache.resolve(key, 'id') as string;
      if (ids && !ids.includes(id)) continue;
      if (cache.resolve(key, 'readAt')) continue;
      cache.writeFragment(ReadAtFragment, { id, readAt });
    }
  }
  cache.invalidate('Query', 'unreadNotificationCount');
};

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

type ListedWorkItem = {
  __typename: 'WorkItem';
  id: string;
  projectId: string;
  sprintId: string | null;
  assigneeId: string | null;
};
type ListArgs = Record<string, unknown> | null | undefined;

/** Every cached work-item list, and whether an item belongs in the variant with these args. */
const workItemLists: Record<string, (args: ListArgs, item: ListedWorkItem) => boolean> = {
  workItemsByProjectId: (args, item) => args?.projectId === item.projectId,
  workItemsBySprintId: (args, item) => args?.sprintId === item.sprintId,
  workItemsInBacklog: (args, item) => item.sprintId === null && args?.projectId === item.projectId,
  workItemsByAssignee: (args, item) =>
    args?.projectId === item.projectId && args?.userId === item.assigneeId,
};

/**
 * Creating an item, or changing its sprint or assignee, changes which lists hold it. Adds it to
 * the end of each cached list it now belongs in (the server ranks new and moved items last) and
 * removes it from the lists it no longer belongs in. Lists it stays in keep their order.
 */
const syncWorkItemLists =
  (field: string): UpdateResolver =>
  (result, _args, cache) => {
    const item = result[field] as ListedWorkItem | null;
    const key = item && cache.keyOfEntity(item);
    if (!item || !key) return;
    for (const { fieldName, arguments: args } of cache.inspectFields('Query')) {
      const belongsIn = workItemLists[fieldName];
      if (!belongsIn) continue;
      const keys = cache.resolve('Query', fieldName, args) as string[] | null;
      if (!keys) continue;
      const belongs = belongsIn(args, item);
      if (belongs === keys.includes(key)) continue;
      cache.link(
        'Query',
        fieldName,
        args,
        belongs ? [...keys, key] : keys.filter((k) => k !== key),
      );
    }
  };

/**
 * Applies the changed fields straight away, so a dragged item lands in its new sprint before the
 * server answers. The server's result replaces it, or it's rolled back if the mutation fails.
 */
const optimisticUpdateWorkItem: OptimisticMutationResolver = (args, cache) => {
  const { id, ...changes } = args.input as { id: string } & Record<string, unknown>;
  const current = cache.readFragment(WorkItemFields, { __typename: 'WorkItem', id });
  if (!current) return null;
  const defined = Object.entries(changes).filter(([, value]) => value !== undefined);
  return { ...current, ...Object.fromEntries(defined), __typename: 'WorkItem' };
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
      Mutation: {
        markNotificationsRead,
        createProject: refetchList('projects'),
        createWorkItem: syncWorkItemLists('createWorkItem'),
        updateWorkItem: syncWorkItemLists('updateWorkItem'),
      },
    },
    optimistic: { updateWorkItem: optimisticUpdateWorkItem },
  });
