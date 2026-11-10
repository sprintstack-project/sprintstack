import LoadState from '@ui/load-state';
import type { ReactNode } from 'react';

/** What a section needs from its query: urql's result, or a placeholder until the API serves it. */
export interface QueryState<T> {
  data: T | undefined;
  fetching: boolean;
  error?: unknown;
  refetch?: () => void;
}

/** Data the API doesn't serve yet, shaped like a finished query so it slots in the same way. */
export const placeholder = <T,>(data: T): QueryState<T> => ({ data, fetching: false });

/**
 * A project query's result, or `empty` once the projects have loaded and none is selected: the
 * query is paused then, so it would otherwise never leave its skeleton.
 */
export const forProject = <T,>(
  query: QueryState<T>,
  { projects, projectId }: { projects: unknown[] | undefined; projectId: string | undefined },
  empty: T,
): QueryState<T> => (projects && !projectId ? placeholder(empty) : query);

interface LoadableProps<T> {
  query: QueryState<T>;
  /** What's loading, e.g. "your next items": read out, and in the error's title. */
  label: string;
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}

/**
 * One tile or widget body: its skeleton until its data lands, and an error with Retry in its place
 * if the query fails, so the rest of the dashboard still shows.
 */
export const Loadable = <T,>({ query, label, skeleton, children }: LoadableProps<T>) => (
  <LoadState
    loading={query.fetching || (query.data === undefined && !query.error)}
    label={`Loading ${label}`}
    skeleton={skeleton}
    failed={Boolean(query.error)}
    errorTitle={`Couldn’t load ${label}`}
    onRetry={query.refetch}
  >
    {query.data !== undefined && children(query.data)}
  </LoadState>
);
