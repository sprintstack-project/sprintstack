'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_FILE_BYTES } from './data';

export interface Upload {
  id: string;
  name: string;
  size: number;
  /** MIME type. */
  type: string;
  /** Bytes sent so far. */
  loaded: number;
  status: 'uploading' | 'done';
}

const accepted = (file: File) =>
  file.type.startsWith('image/') ||
  file.type === 'application/pdf' ||
  file.type === 'text/csv' ||
  file.name.toLowerCase().endsWith('.csv');

const TICK_MS = 200;

/**
 * Files added to the item, and their upload progress. Placeholder until the upload API exists:
 * the progress is simulated, about 3 seconds a file. A finished upload calls `onDone` with its id,
 * a removed one `onRemove`, so the form can keep its `attachments`.
 */
export const useUploads = ({
  initial = [],
  onDone,
  onRemove,
}: {
  initial?: Upload[];
  onDone: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  const [uploads, setUploads] = useState(initial);
  const [rejected, setRejected] = useState<string[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  const callbacks = useRef({ onDone, onRemove });
  callbacks.current = { onDone, onRemove };

  useEffect(() => {
    const running = timers.current;
    return () => {
      for (const timer of running.values()) clearInterval(timer);
    };
  }, []);

  const stop = (id: string) => {
    clearInterval(timers.current.get(id));
    timers.current.delete(id);
  };

  const start = (upload: Upload) => {
    let loaded = 0;
    const step = Math.max(upload.size / 15, 1);
    const timer = setInterval(() => {
      loaded = Math.min(upload.size, loaded + step);
      const done = loaded >= upload.size;
      setUploads((all) =>
        all.map((u) =>
          u.id === upload.id ? { ...u, loaded, status: done ? 'done' : 'uploading' } : u,
        ),
      );
      if (done) {
        stop(upload.id);
        callbacks.current.onDone(upload.id);
      }
    }, TICK_MS);
    timers.current.set(upload.id, timer);
  };

  const add = (files: File[]) => {
    const problems: string[] = [];
    const added: Upload[] = [];
    for (const file of files) {
      if (!accepted(file)) problems.push(`Couldn’t add ${file.name}. Attach an image, PDF or CSV.`);
      else if (file.size > MAX_FILE_BYTES)
        problems.push(`Couldn’t add ${file.name}. Keep files to 25 MB or less.`);
      else
        added.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type || 'text/csv',
          loaded: 0,
          status: 'uploading',
        });
    }
    setRejected(problems);
    setUploads((all) => [...all, ...added]);
    added.forEach(start);
  };

  /** Cancels an upload under way, or removes a finished one. */
  const remove = (id: string) => {
    stop(id);
    setUploads((all) => all.filter((u) => u.id !== id));
    callbacks.current.onRemove(id);
  };

  const clear = () => {
    for (const id of timers.current.keys()) stop(id);
    setUploads([]);
    setRejected([]);
  };

  return {
    uploads,
    rejected,
    pending: uploads.filter((u) => u.status === 'uploading').length,
    add,
    remove,
    clear,
  };
};

export type Uploads = ReturnType<typeof useUploads>;
