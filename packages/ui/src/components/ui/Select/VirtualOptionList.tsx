import { Combobox } from '@base-ui/react/combobox';
import { useVirtualizer, type Virtualizer } from '@tanstack/react-virtual';
import { type CSSProperties, type ReactNode, type RefObject, useLayoutEffect, useRef } from 'react';

export type OptionVirtualizer = Virtualizer<HTMLDivElement, Element>;

/** Props to spread onto each Combobox.Item so the virtualizer can place and measure it. */
export interface VirtualRowProps {
  index: number;
  'data-index': number;
  ref: (node: Element | null) => void;
  style: CSSProperties;
}

interface VirtualOptionListProps<T> {
  /** Filled with the virtualizer, so Root's onItemHighlighted can scroll keyboard moves into view. */
  virtualizerRef: RefObject<OptionVirtualizer | null>;
  /** Row to show when the list opens, e.g. a Select's current value. */
  initialIndex?: number;
  children: (item: T, row: VirtualRowProps) => ReactNode;
}

// Rows are 3.5rem; estimate in px from the root font size (the design-system scale), then measure.
const estimateRow = () =>
  Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 3.5;

/**
 * Renders only the visible rows of a Combobox list (TanStack Virtual). Use inside a Combobox.Root
 * with `virtualized`: Base UI then tracks rows by `index` instead of by what's in the DOM, so
 * keyboard navigation and typeahead still reach rows that aren't rendered.
 */
export function VirtualOptionList<T>({
  virtualizerRef,
  initialIndex,
  children,
}: VirtualOptionListProps<T>) {
  const items = Combobox.useFilteredItems<T>();
  const scrollElement = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement.current,
    estimateSize: estimateRow,
    overscan: 8,
  });
  virtualizerRef.current = virtualizer;

  // Open on the current value rather than the top of the list (only on mount, not while typing).
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount only
  useLayoutEffect(() => {
    if (initialIndex !== undefined && initialIndex >= 0)
      virtualizer.scrollToIndex(initialIndex, { align: 'center' });
  }, []);

  return (
    <Combobox.List
      ref={scrollElement}
      className="max-h-[min(var(--available-height),24rem)] overflow-y-auto overscroll-contain p-2 empty:hidden"
    >
      {items.length > 0 && (
        <div
          role="presentation"
          className="relative w-full"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtual) =>
            children(items[virtual.index], {
              index: virtual.index,
              'data-index': virtual.index,
              ref: virtualizer.measureElement,
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtual.start}px)`,
              },
            }),
          )}
        </div>
      )}
    </Combobox.List>
  );
}

/** Root's onItemHighlighted: keep the keyboard-highlighted row in view. */
export const scrollHighlightedIntoView =
  (virtualizerRef: RefObject<OptionVirtualizer | null>) =>
  (_item: unknown, details: { reason: string; index: number }) => {
    if (details.reason === 'keyboard' && details.index >= 0) {
      virtualizerRef.current?.scrollToIndex(details.index, { align: 'auto' });
    }
  };
