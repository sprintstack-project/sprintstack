'use client';

import { Popover } from '@base-ui/react/popover';
import { usePortalContainer } from '@lib/portal-container';
import type { Editor } from '@tiptap/react';
import { toolbarButton } from '@ui/rich-text-editor/toolbar-button';
import { popupFrame } from '@ui/select/menu';
import { clsx } from 'clsx';
import { EmojiPicker } from 'frimousse';
import { Smile } from 'lucide-react';
import { useState } from 'react';

const status = 'grid h-full place-items-center text-meta font-semibold text-ink-muted';

/** A searchable emoji grid; the chosen emoji is typed at the caret. */
const EmojiPopover = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  const container = usePortalContainer();
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label="Emoji"
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        className={toolbarButton}
      >
        <Smile aria-hidden strokeWidth={2} className="size-5" />
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} align="start" className="z-50 outline-none">
          <Popover.Popup aria-label="Emoji" className={clsx(popupFrame, 'overflow-hidden')}>
            <EmojiPicker.Root
              columns={9}
              onEmojiSelect={({ emoji }) => {
                editor?.chain().focus().insertContent(emoji).run();
                setOpen(false);
              }}
              className="flex h-90 w-[21.5rem] max-w-[calc(100vw-2rem)] flex-col"
            >
              <EmojiPicker.Search
                aria-label="Search emoji"
                placeholder="Search"
                className="m-2 h-10 rounded-md border border-line bg-surface px-3 text-[1rem] text-ink outline-none placeholder:text-ink-placeholder focus-visible:border-line-strong"
              />
              <EmojiPicker.Viewport className="relative flex-1 outline-none">
                <EmojiPicker.Loading className={status}>Loading…</EmojiPicker.Loading>
                <EmojiPicker.Empty className={status}>No emoji found</EmojiPicker.Empty>
                <EmojiPicker.List
                  className="pb-2 select-none"
                  components={{
                    CategoryHeader: ({ category, ...props }) => (
                      <div
                        {...props}
                        className="bg-surface px-3 pt-3 pb-1.5 text-meta font-semibold text-ink-muted"
                      >
                        {category.label}
                      </div>
                    ),
                    Row: ({ children, ...props }) => (
                      <div {...props} className="scroll-my-1.5 px-2">
                        {children}
                      </div>
                    ),
                    Emoji: ({ emoji, ...props }) => (
                      <button
                        {...props}
                        className={clsx(
                          'grid size-9 cursor-pointer place-items-center rounded-md text-[1.375rem]',
                          emoji.isActive && 'bg-surface-hover',
                        )}
                      >
                        {emoji.emoji}
                      </button>
                    ),
                  }}
                />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EmojiPopover;
