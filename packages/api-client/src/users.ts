import { useCallback } from 'react';
import { useClient } from 'urql';
import { MeQuery, UsersQuery } from './documents/users';
import useRootQuery from './useRootQuery';

/**
 * Searches people in the viewer's active organization by name or email. Repeated searches come
 * from the cache.
 */
export const useSearchUsers = (first = 8) => {
  const client = useClient();
  return useCallback(
    async (search: string) => {
      const { data, error } = await client.query(UsersQuery, { search, first }).toPromise();
      if (error) throw error;
      return data?.users ?? [];
    },
    [client, first],
  );
};

/**
 * The rich text editor's `searchMentions`: people in the active organization, with their email
 * underneath. Returns the editor's MentionItem shape without depending on @sprintstack/ui.
 *
 *   <RichTextEditor searchMentions={useSearchMentions()} />
 */
export const useSearchMentions = () => {
  const searchUsers = useSearchUsers();
  return useCallback(
    async (query: string) =>
      (await searchUsers(query)).map(({ id, name, email }) => ({
        id,
        label: name,
        description: email,
      })),
    [searchUsers],
  );
};

export const useGetMe = () => {
  return useRootQuery({ query: MeQuery });
};
