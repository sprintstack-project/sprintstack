'use client';

import { Popover } from '@base-ui/react/popover';
import { usePortalContainer } from '@lib/portal-container';
import { normalizeHref } from '@lib/rich-text';
import type { Editor } from '@tiptap/react';
import { Button } from '@ui/button';
import { Field } from '@ui/field';
import { Input } from '@ui/input';
import { toolbarButton } from '@ui/rich-text-editor/toolbar-button';
import { popupFrame } from '@ui/select/menu';
import { clsx } from 'clsx';
import { Link } from 'lucide-react';
import { useState } from 'react';

/** Adds, edits or removes the link under the selection. With no selection, inserts the URL. */
const LinkPopover = ({
  editor,
  active,
  disabled,
}: {
  editor: Editor | null;
  active: boolean;
  disabled?: boolean;
}) => {
  const container = usePortalContainer();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');

  const apply = () => {
    if (!editor) return;
    const href = normalizeHref(url);
    const chain = editor.chain().focus().extendMarkRange('link');
    if (!href) chain.unsetLink().run();
    else if (editor.state.selection.empty && !editor.isActive('link')) {
      chain
        .insertContent({
          type: 'text',
          text: url.trim(),
          marks: [{ type: 'link', attrs: { href } }],
        })
        .run();
    } else chain.setLink({ href }).run();
    setOpen(false);
  };

  const remove = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setUrl(editor?.getAttributes('link').href ?? '');
      }}
    >
      <Popover.Trigger
        aria-label="Link"
        aria-pressed={active}
        data-pressed={active || undefined}
        disabled={disabled}
        // Keep the selection in the editor while the popover opens.
        onMouseDown={(e) => e.preventDefault()}
        className={toolbarButton}
      >
        <Link aria-hidden strokeWidth={2} className="size-5" />
      </Popover.Trigger>
      <Popover.Portal container={container}>
        <Popover.Positioner sideOffset={8} align="start" className="z-50 outline-none">
          <Popover.Popup
            aria-label="Link"
            className={clsx(popupFrame, 'flex w-96 max-w-[calc(100vw-2rem)] flex-col gap-4 p-5')}
          >
            {/* Enter applies. Not a <form>: the editor may sit inside one, and submit bubbles
                through the portal to it. */}
            <fieldset
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  apply();
                }
              }}
            >
              <Field label="Link address">
                <Input type="url" value={url} onChange={setUrl} placeholder="E.g. example.com" />
              </Field>
            </fieldset>
            <div className="flex justify-end gap-2">
              {active && (
                <Button variant="ghost" size="sm" onClick={remove}>
                  Remove link
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={apply}>
                {active ? 'Update' : 'Add link'}
              </Button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default LinkPopover;
