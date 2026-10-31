import { Button, buttonClass } from '@ui/button';
import { EmptyState } from '@ui/empty-state';
import { PlusIcon, SquareStack } from 'lucide-react';
import Link from 'next/link';

/** In place of the list or board while no sprint is running. */
export const NoSprint = ({ onCreate }: { onCreate?: () => void }) => (
  <section aria-label="Taskboard" className="rounded-2xl border border-line bg-surface py-16">
    <EmptyState
      eyebrow="Taskboard"
      title="No sprint"
      highlight="is running"
      description="The taskboard shows the work in the active sprint. Plan one from the backlog, then start it to see items here."
      actions={
        <>
          <Link href="/backlog" className={buttonClass('brand', 'lg')}>
            <SquareStack aria-hidden strokeWidth={2} className="size-6 shrink-0" />
            Plan a sprint
          </Link>
          <Button size="lg" icon={PlusIcon} onClick={onCreate}>
            Create a work item
          </Button>
        </>
      }
    />
  </section>
);

interface NoMatchesProps {
  /** Says what the filters ask for, and which one to drop to see something, e.g. "No bugs in review…". */
  description: string;
  onClearAll: () => void;
  /** The one filter whose removal brings items back, e.g. `{ label: 'Status', … }`. */
  suggestion?: { label: string; onRemove: () => void };
}

/** In place of the list or board when the sprint has items but the filters leave none. */
export const NoMatches = ({ description, onClearAll, suggestion }: NoMatchesProps) => (
  <section aria-label="Work items" className="rounded-2xl border border-line bg-surface py-12">
    <EmptyState
      art="top"
      eyebrow="0 results"
      title="Nothing matches"
      description={description}
      actions={
        <>
          <Button variant="primary" size="lg" onClick={onClearAll}>
            Clear all filters
          </Button>
          {suggestion && (
            <Button size="lg" onClick={suggestion.onRemove}>
              Remove “{suggestion.label}”
            </Button>
          )}
        </>
      }
    />
  </section>
);
