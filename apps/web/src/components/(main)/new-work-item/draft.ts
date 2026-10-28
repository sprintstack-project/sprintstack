import type { WorkItemInput } from '@sprintstack/shared';
import { emptyWorkItem } from './data';
import type { Upload } from './use-uploads';

// The unfinished item, kept in this browser so closing the dialog (or the tab) doesn't lose it.
// One draft per browser until drafts are saved through the API.

const KEY = 'sprintstack:new-work-item-draft';

export interface Draft {
  values: WorkItemInput;
  /** Finished uploads, so their rows come back with the draft. */
  files: Upload[];
  savedAt: number;
}

export const loadDraft = (): Draft | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    // Storage blocked or the draft unreadable: start fresh.
    return null;
  }
};

/** Saves the draft, or forgets it once the form is back to blank. Returns when it was saved. */
export const saveDraft = (values: WorkItemInput, files: Upload[]): number | null => {
  const blank =
    files.length === 0 && JSON.stringify(values) === JSON.stringify(emptyWorkItem(values.sprint));
  try {
    if (blank) {
      localStorage.removeItem(KEY);
      return null;
    }
    const savedAt = Date.now();
    localStorage.setItem(KEY, JSON.stringify({ values, files, savedAt } satisfies Draft));
    return savedAt;
  } catch {
    return null;
  }
};

export const clearDraft = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing stored to clear.
  }
};
