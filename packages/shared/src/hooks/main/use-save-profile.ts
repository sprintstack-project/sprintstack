import { useCreateAvatarUpload, useUpdateMe } from '@sprintstack/api-client/users';
import { useCallback } from 'react';
import type { AvatarContentType, ProfileInput } from '../../schemas/profile';

/** A new photo. `file` is what FormData takes: a Blob on web, `{ uri, name, type }` on native. */
export interface NewPhoto {
  contentType: AvatarContentType;
  file: unknown;
}

/** Saves the profile. `photo` is a new one, null to go back to initials, or undefined to keep it. */
export const useSaveProfile = () => {
  const [, createUpload] = useCreateAvatarUpload();
  const [, updateMe] = useUpdateMe();

  return useCallback(
    async ({ name, jobTitle, photo }: ProfileInput & { photo?: NewPhoto | null }) => {
      let image: string | null | undefined = photo === null ? null : undefined;

      if (photo) {
        const { data, error } = await createUpload({ contentType: photo.contentType });
        if (error || !data) throw error ?? new Error('Couldn’t start the upload');
        const { key, url, fields } = data.createAvatarUpload;
        // S3 reads the policy fields first and ignores anything after `file`.
        const body = new FormData();
        for (const field of fields) body.append(field.name, field.value);
        body.append('file', photo.file as Blob);
        const response = await fetch(url, { method: 'POST', body });
        if (!response.ok) throw new Error(`Upload failed with ${response.status}`);
        image = key;
      }

      const { error } = await updateMe({ name, jobTitle, image });
      if (error) throw error;
    },
    [createUpload, updateMe],
  );
};
