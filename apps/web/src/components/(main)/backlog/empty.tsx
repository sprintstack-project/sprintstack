import { Button } from '@ui/button';
import { EmptyState } from '@ui/empty-state';
import { PlusIcon } from 'lucide-react';
import type { ItemType } from '../taskboard/data';
import { TypeIcon } from '../taskboard/parts';

const QUICK_ADD: { type: ItemType; label: string }[] = [
  { type: 'story', label: 'Story' },
  { type: 'task', label: 'Task' },
  { type: 'bug', label: 'Bug' },
];

interface EmptyBacklogProps {
  /** With a type from the quick-add row, or none from the main button. */
  onCreate?: (type?: ItemType) => void;
  onImport?: () => void;
}

/** The backlog group's body while the project has no items at all. */
export const EmptyBacklog = ({ onCreate, onImport }: EmptyBacklogProps) => (
  <div className="border-t border-line pb-10">
    <EmptyState
      art="bottom"
      eyebrow="Backlog"
      title="Your backlog"
      highlight="is empty"
      description="Capture everything the team might work on. Rank it here, then drag the top items into a sprint."
      actions={
        <>
          <Button variant="brand" size="lg" icon={PlusIcon} onClick={() => onCreate?.()}>
            Create a work item
          </Button>
          <Button size="lg" onClick={onImport}>
            Import from CSV
          </Button>
        </>
      }
    />
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 text-meta text-ink-muted">
      <span>Quick add:</span>
      {QUICK_ADD.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onCreate?.(type)}
          className="kbd-focus inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-2 text-ink transition-colors duration-120 hover:bg-surface-hover"
        >
          <span aria-hidden>
            <TypeIcon type={type} />
          </span>
          {label}
        </button>
      ))}
    </div>
  </div>
);
