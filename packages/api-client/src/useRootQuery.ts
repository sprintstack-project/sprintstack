// packages/api-client/src/use-root-query.ts
import { useMemo } from 'react';
import { type AnyVariables, type UseQueryArgs, useQuery } from 'urql';

/**
 * useQuery for queries with a single root field: returns that field as `data` instead of
 * `data.field`. Queries that select several root fields (like the bell) use useQuery directly.
 */
const useRootQuery = <Data, Variables extends AnyVariables>(
  args: UseQueryArgs<Variables, Data>,
) => {
  const [{ data, fetching, error, hasNext, stale, extensions, operation }, refetch] =
    useQuery(args);

  return useMemo(
    () => ({
      data: data ? (Object.values(data)[0] as Data[keyof Data]) : undefined,
      fetching,
      error,
      hasNext,
      stale,
      extensions,
      operation,
      refetch,
    }),
    [data, fetching, error, hasNext, stale, extensions, operation, refetch],
  );
};

export default useRootQuery;
