'use client';

import type { MeQuery } from '@sprintstack/api-client/documents/users';
import type { ResultOf } from '@sprintstack/api-client/graphql';
import { useGetMe } from '@sprintstack/api-client/users';
import { useAppForm } from '@sprintstack/forms/form';
import { type NewPhoto, useSaveProfile } from '@sprintstack/shared/hooks/main/use-save-profile';
import { initialsOf } from '@sprintstack/shared/initials';
import {
  AVATAR_CONTENT_TYPES,
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
import Section from '@ui/section';
import Skeleton from '@ui/skeleton';
import { formatDistanceToNowStrict } from 'date-fns';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

type Me = ResultOf<typeof MeQuery>['me'];
type PickedPhoto = NewPhoto & { preview: string };

const MINUTE = 60_000;

/** "just now", then "2 minutes ago", kept current while the page stays open. */
const useTimeAgo = (date: Date | undefined) => {
  const [label, setLabel] = useState<string>();
  useEffect(() => {
    if (!date) return setLabel(undefined);
    const update = () =>
      setLabel(
        Date.now() - date.getTime() < MINUTE
          ? 'just now'
          : formatDistanceToNowStrict(date, { addSuffix: true }),
      );
    update();
    const timer = setInterval(update, MINUTE);
    return () => clearInterval(timer);
  }, [date]);
  return label;
};

const ProfileForm = ({ me }: { me: Me }) => {
  const saveProfile = useSaveProfile();
  // undefined keeps the saved photo; null goes back to initials.
  const [photo, setPhoto] = useState<PickedPhoto | null>();
  const [photoError, setPhotoError] = useState<string>();
  const [savedAt, setSavedAt] = useState<Date>();
  const [failed, setFailed] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const savedLabel = useTimeAgo(savedAt);

  const saved = { name: me.name, jobTitle: me.jobTitle ?? '' };
  const form = useAppForm({
    defaultValues: saved,
    validators: { onChange: profileSchema },
    onSubmit: async ({ value, formApi }) => {
      const profile = profileSchema.parse(value);
      setFailed(false);
      try {
        await saveProfile({ ...profile, photo });
        formApi.reset(profile);
        setPhoto(undefined);
        setSavedAt(new Date());
      } catch {
        setFailed(true);
      }
    },
  });
  const name = useSelector(form.store, (state) => state.values.name);
  const saving = useSelector(form.store, (state) => state.isSubmitting);

  const pick = (file: File | undefined) => {
    if (!file) return;
    if (!isAvatarContentType(file.type)) {
      setPhotoError('Use a PNG, JPEG or WebP image.');
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setPhotoError('That image is too large; keep it to 3 MB or less.');
      return;
    }
    const contentType = file.type;
    const preview = URL.createObjectURL(file);
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth < AVATAR_MIN_SIZE || probe.naturalHeight < AVATAR_MIN_SIZE) {
        URL.revokeObjectURL(preview);
        setPhotoError(
          `That image is too small; use at least ${AVATAR_MIN_SIZE} × ${AVATAR_MIN_SIZE}.`,
        );
        return;
      }
      setPhoto({ contentType, file, preview });
      setPhotoError(undefined);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(preview);
      setPhotoError('That file couldn’t be read. Use a PNG, JPEG or WebP image.');
    };
    probe.src = preview;
  };

  const shown = photo === undefined ? me.image : (photo?.preview ?? null);
  const status = saving ? 'saving' : failed ? 'error' : savedAt ? 'saved' : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Section
        title="Profile"
        description="Shown to everyone in your projects, next to your work and comments."
      >
        <div className="flex flex-wrap items-center gap-6">
          {shown ? (
            <Image
              src={shown}
              alt=""
              width={144}
              height={144}
              unoptimized
              className="size-36 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="grid size-36 shrink-0 place-items-center rounded-full bg-brand headline text-[3.5rem] leading-none text-on-brand"
            >
              {initialsOf(name) || '?'}
            </span>
          )}
          <Field
            label="Photo"
            htmlFor={fileInputId}
            description={`Square, at least ${AVATAR_MIN_SIZE} × ${AVATAR_MIN_SIZE}. We crop it to a circle.`}
            error={photoError}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" icon={Upload} onClick={() => fileInput.current?.click()}>
                Upload photo
              </Button>
              {shown && (
                <Button variant="ghost" onClick={() => setPhoto(null)}>
                  Use initials
                </Button>
              )}
              <input
                ref={fileInput}
                id={fileInputId}
                type="file"
                accept={AVATAR_CONTENT_TYPES.join(',')}
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                  pick(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </div>
          </Field>
        </div>
        <form.AppField name="name">
          {(f) => <f.TextField label="Full name" required autoComplete="name" />}
        </form.AppField>
        <Field
          label="Email"
          labelAside={me.emailVerified ? <Badge tone="success">Verified</Badge> : undefined}
        >
          <Input type="email" value={me.email} disabled />
        </Field>
        <form.AppField name="jobTitle">
          {(f) => (
            <f.TextField
              label="Job title"
              description="Optional. Shown on your profile card."
              autoComplete="organization-title"
            />
          )}
        </form.AppField>
      </Section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <form.AppForm>
          <form.FormActions />
        </form.AppForm>
        {status && (
          <SaveStatus state={status} savedAt={savedLabel} onRetry={() => form.handleSubmit()} />
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const { data: me, error, refetch } = useGetMe();
  return (
    <LoadState
      loading={me === undefined && !error}
      label="Loading your profile"
      skeleton={
        <div className="flex flex-col gap-6">
          <Skeleton shape="circle" width={144} />
          <Skeleton shape="input" />
          <Skeleton shape="input" />
          <Skeleton shape="input" />
        </div>
      }
      failed={Boolean(error)}
      errorTitle="Couldn’t load your profile"
      onRetry={refetch}
    >
      {me && <ProfileForm key={me.id} me={me} />}
    </LoadState>
  );
};

export default Profile;
