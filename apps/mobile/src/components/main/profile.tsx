import type { MeQuery } from '@sprintstack/api-client/documents/users';
import type { ResultOf } from '@sprintstack/api-client/graphql';
import { useGetMe } from '@sprintstack/api-client/users';
import { useAppForm } from '@sprintstack/forms/form';
import { type NewPhoto, useSaveProfile } from '@sprintstack/shared/hooks/main/use-save-profile';
import { initialsOf } from '@sprintstack/shared/initials';
import {
  AVATAR_MAX_BYTES,
  AVATAR_MIN_SIZE,
  isAvatarContentType,
  profileSchema,
} from '@sprintstack/shared/schemas/profile';
import { useSelector } from '@tanstack/react-form';
import Badge from '@ui/badge';
import Button from '@ui/button';
import Field from '@ui/field';
import Input from '@ui/input';
import LoadState from '@ui/load-state';
import SaveStatus from '@ui/save-status';
import Skeleton from '@ui/skeleton';
import Text from '@ui/text';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { useState } from 'react';
import { Image, View } from 'react-native';

type Me = ResultOf<typeof MeQuery>['me'];
type PickedPhoto = NewPhoto & { preview: string };

const ProfileForm = ({ me }: { me: Me }) => {
  const saveProfile = useSaveProfile();
  // undefined keeps the saved photo; null goes back to initials.
  const [photo, setPhoto] = useState<PickedPhoto | null>();
  const [photoError, setPhotoError] = useState<string>();
  const [status, setStatus] = useState<'saved' | 'error'>();

  const form = useAppForm({
    defaultValues: { name: me.name, jobTitle: me.jobTitle ?? '' },
    validators: { onChange: profileSchema },
    onSubmit: async ({ value, formApi }) => {
      const profile = profileSchema.parse(value);
      setStatus(undefined);
      try {
        await saveProfile({ ...profile, photo });
        formApi.reset(profile);
        setPhoto(undefined);
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    },
  });
  const name = useSelector(form.store, (state) => state.values.name);

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    if (!isAvatarContentType(asset.mimeType)) {
      setPhotoError('Use a PNG, JPEG or WebP image.');
      return;
    }
    if (asset.fileSize && asset.fileSize > AVATAR_MAX_BYTES) {
      setPhotoError('That image is too large; keep it to 3 MB or less.');
      return;
    }
    if (asset.width < AVATAR_MIN_SIZE || asset.height < AVATAR_MIN_SIZE) {
      setPhotoError(
        `That image is too small; use at least ${AVATAR_MIN_SIZE} × ${AVATAR_MIN_SIZE}.`,
      );
      return;
    }
    setPhoto({
      contentType: asset.mimeType,
      file: { uri: asset.uri, name: asset.fileName ?? 'avatar', type: asset.mimeType },
      preview: asset.uri,
    });
    setPhotoError(undefined);
  };

  const shown = photo === undefined ? me.image : (photo?.preview ?? null);

  return (
    <View className="gap-5">
      <View className="flex-row items-center gap-6">
        {shown ? (
          <Image
            source={{ uri: shown }}
            accessibilityIgnoresInvertColors
            className="size-28 rounded-full"
          />
        ) : (
          <View aria-hidden className="size-28 items-center justify-center rounded-full bg-brand">
            <Text className="text-[2.5rem] leading-12 font-extrabold uppercase text-on-brand">
              {initialsOf(name) || '?'}
            </Text>
          </View>
        )}
        <View className="flex-1 items-center gap-2">
          <Button variant="secondary" size="sm" icon={Camera} onClick={pick}>
            Change photo
          </Button>
          {shown && (
            <Button variant="ghost" size="sm" onClick={() => setPhoto(null)}>
              Use initials
            </Button>
          )}
        </View>
      </View>
      {photoError && <Text className="text-meta font-bold text-brand-ink">{photoError}</Text>}
      <form.AppField name="name">
        {(f) => <f.TextField label="Full name" required autoComplete="name" />}
      </form.AppField>
      <Field
        label="Email"
        labelAside={me.emailVerified ? <Badge tone="done">Verified</Badge> : undefined}
      >
        <Input type="email" value={me.email} disabled />
      </Field>
      <form.AppField name="jobTitle">
        {(f) => <f.TextField label="Job title" autoComplete="organization-title" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton size="lg" fullwidth>
          Save changes
        </form.SubmitButton>
      </form.AppForm>
      {status && (
        <View className="items-center">
          <SaveStatus state={status} onRetry={() => form.handleSubmit()} />
        </View>
      )}
    </View>
  );
};

export const Profile = () => {
  const { data: me, error, refetch } = useGetMe();
  return (
    <LoadState
      loading={me === undefined && !error}
      label="Loading your profile"
      skeleton={
        <View className="gap-5">
          <Skeleton shape="circle" width={112} />
          <Skeleton shape="input" />
          <Skeleton shape="input" />
          <Skeleton shape="input" />
        </View>
      }
      failed={Boolean(error)}
      errorTitle="Couldn’t load your profile"
      onRetry={refetch}
    >
      {me && <ProfileForm key={me.id} me={me} />}
    </LoadState>
  );
};
