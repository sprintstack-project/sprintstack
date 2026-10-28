'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@ui/card';
import { GripVertical, SquareArrowOutUpRight, X } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const iconButton =
  'kbd-focus grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors duration-120 hover:bg-surface-hover hover:text-ink';

interface WidgetProps {
  id: string;
  title: string;
  /** The page the widget summarises. */
  href: string;
  onRemove: () => void;
  children: ReactNode;
}

/** A dashboard panel: dragged by its handle to reorder, removed with the close button. */
const Widget = ({ id, title, href, onRemove, children }: WidgetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      // A grid so the card fills the row's height.
      className={`grid ${isDragging ? 'relative z-10 opacity-85 shadow-popover' : ''}`}
    >
      <Card
        actions={
          <div className="-my-2 flex flex-1 items-center gap-1">
            <button
              ref={setActivatorNodeRef}
              type="button"
              aria-label={`Move ${title}`}
              className={`${iconButton} -ml-3 cursor-grab touch-none active:cursor-grabbing`}
              {...attributes}
              {...listeners}
            >
              <GripVertical aria-hidden strokeWidth={2} className="size-5" />
            </button>
            <h2 className="headline flex-1 truncate text-title text-ink">{title}</h2>
            <Link href={href} aria-label={`Open ${title}`} className={iconButton}>
              <SquareArrowOutUpRight aria-hidden strokeWidth={2} className="size-5" />
            </Link>
            <button
              type="button"
              aria-label={`Remove ${title}`}
              onClick={onRemove}
              className={`${iconButton} -mr-2`}
            >
              <X aria-hidden strokeWidth={2} className="size-5" />
            </button>
          </div>
        }
      >
        {children}
      </Card>
    </div>
  );
};

export default Widget;
