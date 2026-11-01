'use client';

import { twMerge } from '@lib/tw-merge';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { PROJECT_DESCRIPTION_MAX_LENGTH, projectDetailsSchema } from '@sprintstack/shared';
import { Button, buttonClass } from '@ui/button';
import { Field } from '@ui/field';
import { Section } from '@ui/section';
import { Archive, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import { detailsForm, save, useSaved } from './data';

const ICON_MIN_SIZE = 256;

/** The project tile: the uploaded image, or the key on brand. */
const ProjectIcon = ({ image, code }: { image: string | null; code: string }) =>
  image ? (
    <Image
      src={image}
      alt=""
      width={112}
      height={112}
      unoptimized
      className="size-28 shrink-0 rounded-3xl object-cover"
    />
  ) : (
    <span
      aria-hidden
      className="grid size-28 shrink-0 place-items-center rounded-3xl bg-brand px-2 headline text-[2.5rem] leading-none text-on-brand"
    >
      {code.slice(0, 3) || '?'}
    </span>
  );

const Details = () => {
  const saved = useSaved();
  const [image, setImage] = useState(saved.image);
  const [imageError, setImageError] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const form = useAppForm({
    ...detailsForm,
    defaultValues: saved.details,
    onSubmit: ({ value, formApi }) => {
      const details = projectDetailsSchema.parse(value);
      save({ details, image });
      formApi.reset(details);
    },
  });
  const key = useSelector(form.store, (state) => state.values.key);

  const pick = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const probe = new window.Image();
    probe.onload = () => {
      // SVGs scale, so only PNGs need the pixels.
      if (
        file.type === 'image/png' &&
        (probe.naturalWidth < ICON_MIN_SIZE || probe.naturalHeight < ICON_MIN_SIZE)
      ) {
        URL.revokeObjectURL(url);
        setImageError(`That image is too small; use at least ${ICON_MIN_SIZE} × ${ICON_MIN_SIZE}.`);
        return;
      }
      setImage(url);
      setImageError(undefined);
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setImageError('That file couldn’t be read. Use a PNG or SVG.');
    };
    probe.src = url;
  };

  const discard = () => {
    form.reset(saved.details);
    setImage(saved.image);
    setImageError(undefined);
  };

  return (
    <>
      <Section
        title="Details"
        description="Shown across the app, in links and in notification emails."
      >
        <div className="flex flex-wrap items-center gap-6">
          <ProjectIcon image={image} code={key} />
          <Field
            label="Project icon"
            htmlFor={fileInputId}
            description={`PNG or SVG, at least ${ICON_MIN_SIZE} × ${ICON_MIN_SIZE}.`}
            error={imageError}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                icon={ImageIcon}
                onClick={() => fileInput.current?.click()}
              >
                Upload image
              </Button>
              {image && (
                <Button variant="ghost" onClick={() => setImage(null)}>
                  Use initials
                </Button>
              )}
              <input
                ref={fileInput}
                id={fileInputId}
                type="file"
                accept="image/png,image/svg+xml"
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
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(10rem,18rem)]">
          <form.AppField name="name">
            {(f) => <f.TextField label="Project name" required />}
          </form.AppField>
          <form.AppField
            name="key"
            listeners={{
              // Keys are capitals, whatever was typed.
              onChange: ({ value }) => {
                const upper = value.toUpperCase();
                if (upper !== value) form.setFieldValue('key', upper);
              },
            }}
          >
            {(f) => (
              <f.TextField
                label="Key"
                required
                description={`Prefix for IDs, e.g. ${key || 'PAY'}-1482`}
                autoComplete="off"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="description">
          {(f) => (
            <f.TextAreaField
              label="Description"
              rows={3}
              maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
            />
          )}
        </form.AppField>
        <div className="border-t border-line pt-8">
          <form.AppForm>
            <form.FormActions onDiscard={discard} />
          </form.AppForm>
        </div>
      </Section>
      <section className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-danger p-6 md:px-10 md:py-8">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="headline text-[1.875rem] leading-none text-ink">Archive project</h2>
          <p className="text-[1.0625rem] leading-6 text-ink-muted font-stretch-semi-condensed">
            Hides {saved.details.name} from everyone and stops notifications. Work items stay
            searchable and you can restore it within 30 days.
          </p>
        </div>
        {/* Archiving needs the API; the button is here so the layout is final. */}
        <button
          type="button"
          className={twMerge(
            buttonClass('secondary', 'lg'),
            'border-danger text-danger not-disabled:hover:bg-surface-hover',
          )}
        >
          <Archive aria-hidden strokeWidth={2} className="size-6" />
          Archive
        </button>
      </section>
    </>
  );
};

export default Details;
