'use client';

import { clsx } from 'clsx';
import { CircleAlert, Trash2, Upload as UploadIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ACCEPTED_FILES } from './data';
import type { Upload, Uploads } from './use-uploads';

const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const tiles = {
  pdf: 'bg-danger text-on-danger',
  image: 'bg-info-subtle text-info-ink',
  csv: 'bg-success-subtle text-success-ink',
};

const tileOf = (upload: Upload) =>
  upload.type === 'application/pdf' ? 'pdf' : upload.type.startsWith('image/') ? 'image' : 'csv';

const extension = (name: string) => name.split('.').pop()?.toUpperCase() ?? '';

const kbd =
  'rounded-md border border-line-strong px-1.5 py-0.5 font-sans text-badge text-ink-muted';

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

const UploadRow = ({ upload, onRemove }: { upload: Upload; onRemove: () => void }) => {
  const uploading = upload.status === 'uploading';
  const percent = Math.round((upload.loaded / upload.size) * 100);
  return (
    <li className="flex items-center gap-5 border-b border-line py-4">
      <span
        aria-hidden
        className={clsx(
          'flex size-14 shrink-0 items-end justify-center rounded-md pb-2 font-display text-badge font-extrabold',
          tiles[tileOf(upload)],
        )}
      >
        {extension(upload.name)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[1.0625rem] leading-6 font-bold text-ink font-stretch-semi-condensed">
          {upload.name}
        </span>
        <span className="text-meta text-ink-muted tabular-nums font-stretch-semi-condensed">
          {uploading
            ? `${formatBytes(upload.loaded)} of ${formatBytes(upload.size)} · uploading ${percent}%`
            : `${formatBytes(upload.size)} · uploaded by you · just now`}
        </span>
        {uploading && (
          <div
            role="progressbar"
            aria-label={`Uploading ${upload.name}`}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-1 h-1.5 overflow-hidden rounded-full bg-line"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-200 ease-linear motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        )}
      </div>
      {uploading ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Cancel uploading ${upload.name}`}
          className="kbd-focus h-10 shrink-0 cursor-pointer rounded-full px-4 text-[1.0625rem] font-extrabold text-ink font-stretch-condensed hover:bg-surface-hover"
        >
          Cancel
        </button>
      ) : (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${upload.name}`}
          className="kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover"
        >
          <Trash2 aria-hidden strokeWidth={2} className="size-5" />
        </button>
      )}
    </li>
  );
};

/** A drop zone (also takes pasted screenshots) and the files added so far. */
export const AttachmentsTab = ({ uploads }: { uploads: Uploads }) => {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { add } = uploads;

  // A screenshot pasted anywhere while this tab is open is added. Text pastes are left alone.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = [...(e.clipboardData?.files ?? [])];
      if (files.length === 0) return;
      e.preventDefault();
      add(files);
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [add]);

  return (
    <div className="flex flex-col gap-4">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: dropping is a shortcut; "browse" is the accessible way in */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          add([...e.dataTransfer.files]);
        }}
        className={clsx(
          'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-120',
          dragging ? 'border-ink bg-surface-hover' : 'border-line-strong',
        )}
      >
        <span className="grid size-14 place-items-center rounded-full bg-surface-muted text-ink">
          <UploadIcon aria-hidden strokeWidth={2} className="size-6" />
        </span>
        <p className="text-[1.1875rem] leading-6 font-bold text-ink font-stretch-semi-condensed">
          Drop files here or{' '}
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="link kbd-focus cursor-pointer rounded-sm"
          >
            browse
          </button>
        </p>
        <p className="text-meta text-ink-muted font-stretch-semi-condensed">
          Images, PDFs, CSVs up to 25 MB each · paste a screenshot with{' '}
          <kbd className={kbd}>{isMac() ? '⌘V' : 'Ctrl V'}</kbd>
        </p>
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPTED_FILES}
          aria-label="Add files"
          tabIndex={-1}
          className="sr-only"
          onChange={(e) => {
            add([...(e.target.files ?? [])]);
            e.target.value = '';
          }}
        />
      </div>
      {uploads.rejected.length > 0 && (
        <ul aria-live="polite" className="flex flex-col gap-1">
          {uploads.rejected.map((problem) => (
            <li
              key={problem}
              className="flex items-center gap-1.5 text-meta font-bold text-brand-ink font-stretch-semi-condensed"
            >
              <CircleAlert aria-hidden strokeWidth={2} className="size-4.5 shrink-0" />
              {problem}
            </li>
          ))}
        </ul>
      )}
      {uploads.uploads.length > 0 && (
        <ul className="flex flex-col border-t border-line">
          {uploads.uploads.map((upload) => (
            <UploadRow key={upload.id} upload={upload} onRemove={() => uploads.remove(upload.id)} />
          ))}
        </ul>
      )}
    </div>
  );
};
