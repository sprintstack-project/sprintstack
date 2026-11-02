'use client';

import { ReactRenderer } from '@tiptap/react';
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
  SuggestionProps,
} from '@tiptap/suggestion';
import { hairline, popup, row } from '@ui/select/menu';
import type { MentionItem } from '@ui/types';
import { clsx } from 'clsx';
import { type Ref, useImperativeHandle, useState } from 'react';

export interface MentionListHandle {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
}

type MentionListProps = Pick<
  SuggestionProps<MentionItem, { id: string; label: string }>,
  'items' | 'command' | 'loading' | 'query'
> & { ref?: Ref<MentionListHandle> };

/**
 * The `@` suggestions. Focus stays in the editor, so the arrow keys, Enter and Tab reach this list
 * through Tiptap's suggestion plugin (`onKeyDown`) rather than the DOM.
 */
const MentionList = ({ items, command, loading, query, ref }: MentionListProps) => {
  const [index, setIndex] = useState(0);

  // New results start at the top.
  const [shown, setShown] = useState(items);
  if (shown !== items) {
    setShown(items);
    setIndex(0);
  }

  const choose = (i: number) => {
    const item = items[i];
    if (item) command({ id: item.id, label: item.label });
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (!items.length) return false;
      if (event.key === 'ArrowDown') setIndex((i) => (i + 1) % items.length);
      else if (event.key === 'ArrowUp') setIndex((i) => (i - 1 + items.length) % items.length);
      else if (event.key === 'Enter' || event.key === 'Tab') choose(index);
      else return false;
      return true;
    },
  }));

  if (!items.length) {
    return (
      <div className={clsx(popup, 'w-72 px-4 py-3 text-meta font-semibold text-ink-muted')}>
        {loading ? 'Searching…' : query ? `No one matches “${query}”` : 'No one to mention'}
      </div>
    );
  }

  return (
    <div role="listbox" aria-label="People" className={clsx(popup, 'w-72')}>
      {items.map((item, i) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: keys come from the editor (onKeyDown above)
        <div
          key={item.id}
          role="option"
          tabIndex={-1}
          aria-selected={i === index}
          data-highlighted={i === index || undefined}
          // Keep focus (and the caret) in the editor.
          onMouseDown={(e) => e.preventDefault()}
          onMouseEnter={() => setIndex(i)}
          onClick={() => choose(i)}
          className={clsx(row, hairline)}
        >
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-semibold">{item.label}</span>
            {item.description && (
              <span className="truncate text-meta text-ink-muted">{item.description}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

/** Tiptap's suggestion `render`: mounts MentionList by the caret and forwards keys to it. */
export const renderMentionList: SuggestionOptions<MentionItem>['render'] = () => {
  let component: ReactRenderer<MentionListHandle, MentionListProps> | undefined;
  let unmount: (() => void) | undefined;
  return {
    onStart: (props) => {
      component = new ReactRenderer(MentionList, {
        props,
        editor: props.editor,
        className: 'z-50',
      });
      unmount = props.mount(component.element);
    },
    onUpdate: (props) => component?.updateProps(props),
    onKeyDown: (props) => component?.ref?.onKeyDown(props) ?? false,
    onExit: () => {
      unmount?.();
      component?.destroy();
    },
  };
};

export default MentionList;
