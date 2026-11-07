'use client';

import { Toggle } from '@base-ui/react/toggle';
import { usePortalContainer } from '@lib/portal-container';
import { blobToDataUrl, EMPTY_DOC, sameDoc } from '@lib/rich-text';
import { Extension } from '@tiptap/core';
import FileHandler from '@tiptap/extension-file-handler';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import { Placeholder } from '@tiptap/extensions';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { type Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useField } from '@ui/field';
import EmojiPopover from '@ui/rich-text-editor/emoji-popover';
import LinkPopover from '@ui/rich-text-editor/link-popover';
import { mentionListRenderer } from '@ui/rich-text-editor/mention-list';
import { toolbarButton } from '@ui/rich-text-editor/toolbar-button';
import type { RichTextDoc, RichTextEditorProps } from '@ui/types';
import { clsx } from 'clsx';
import {
  Bold,
  Code,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const tools = [
  {
    name: 'bold',
    label: 'Bold',
    icon: Bold,
    run: (e: Editor) => e.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    label: 'Italic',
    icon: Italic,
    run: (e: Editor) => e.chain().focus().toggleItalic().run(),
  },
  {
    name: 'strike',
    label: 'Strikethrough',
    icon: Strikethrough,
    run: (e: Editor) => e.chain().focus().toggleStrike().run(),
  },
  {
    name: 'code',
    label: 'Inline code',
    icon: Code,
    run: (e: Editor) => e.chain().focus().toggleCode().run(),
  },
  {
    name: 'bulletList',
    label: 'Bulleted list',
    icon: List,
    run: (e: Editor) => e.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    label: 'Numbered list',
    icon: ListOrdered,
    run: (e: Editor) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'blockquote',
    label: 'Quote',
    icon: Quote,
    run: (e: Editor) => e.chain().focus().toggleBlockquote().run(),
  },
] as const;

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

/** A plain click on a link places the caret (so it stays editable); ⌘/Ctrl-click opens it. */
const OpenLinkOnModClick = Extension.create({
  name: 'openLinkOnModClick',
  addProseMirrorPlugins: () => [
    new Plugin({
      key: new PluginKey('openLinkOnModClick'),
      // The DOM click, not ProseMirror's handleClick: that skips clicks it counts as double clicks.
      props: {
        handleDOMEvents: {
          click: (view, event) => {
            if (!event.metaKey && !event.ctrlKey) return false;
            const link = (event.target as HTMLElement | null)?.closest('a');
            if (!link?.href || !view.dom.contains(link)) return false;
            event.preventDefault();
            window.open(link.href, '_blank', 'noopener,noreferrer');
            return true;
          },
        },
      },
    }),
  ],
});

const RichTextEditor = ({
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  minRows = 5,
  uploadImage,
  searchMentions,
  invalid,
  disabled,
}: RichTextEditorProps) => {
  const field = useField();
  // The last document we reported. A `value` equal to it is our own echo; anything else is an
  // outside change (like form.reset after data loads) and replaces the content. No `key` hacks.
  const reported = useRef<RichTextDoc | null | undefined>(value ?? defaultValue);
  const portalContainer = usePortalContainer();
  const callbacks = useRef({ onChange, onBlur, uploadImage, searchMentions, portalContainer });
  callbacks.current = { onChange, onBlur, uploadImage, searchMentions, portalContainer };
  const fileInput = useRef<HTMLInputElement>(null);

  // Uploads (or embeds) each image, then inserts it at `pos`, or at the caret.
  const insertImages = async (e: Editor, files: File[], pos?: number) => {
    for (const file of files) {
      const src = await (callbacks.current.uploadImage ?? blobToDataUrl)(file);
      e.chain().focus(pos).setImage({ src, alt: file.name }).run();
      pos = undefined;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Placeholder.configure({ placeholder }),
      Image.configure({
        allowBase64: true,
        // Corner handles; the width and height it commits are saved on the node.
        resize: {
          enabled: true,
          directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          minWidth: 48,
          minHeight: 48,
          alwaysPreserveAspectRatio: true,
        },
      }),
      OpenLinkOnModClick,
      // Always loaded, so saved mentions render; `@` only suggests when there's a search.
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          allow: () => Boolean(callbacks.current.searchMentions),
          items: async ({ query }) => (await callbacks.current.searchMentions?.(query)) ?? [],
          render: mentionListRenderer(() => callbacks.current.portalContainer),
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: IMAGE_TYPES,
        // Pasting an image copied from a page also carries its HTML; take the file, not both.
        consumePasteEvent: true,
        onPaste: (e, files) => insertImages(e, files),
        onDrop: (e, files, pos) => insertImages(e, files, pos),
      }),
    ],
    content: value ?? defaultValue ?? EMPTY_DOC,
    editable: !disabled,
    // Render on the client only, so Next.js server rendering doesn't mismatch.
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      const doc = e.getJSON() as RichTextDoc;
      reported.current = doc;
      callbacks.current.onChange?.(doc);
    },
    onBlur: () => callbacks.current.onBlur?.(),
  });

  useEffect(() => {
    if (!editor || value === undefined || sameDoc(value, reported.current)) return;
    reported.current = value;
    if (!sameDoc(value, editor.getJSON() as RichTextDoc)) {
      editor.commands.setContent(value ?? EMPTY_DOC, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  // The editable element is Tiptap's; label it from the surrounding Field.
  const isInvalid = invalid || field?.invalid;
  useEffect(() => {
    editor?.setOptions({
      editorProps: {
        attributes: {
          ...(id && { id }),
          role: 'textbox',
          'aria-multiline': 'true',
          ...(field && { 'aria-labelledby': field.labelId }),
          ...(field?.hintId && { 'aria-describedby': field.hintId }),
          ...(isInvalid && { 'aria-invalid': 'true' }),
          class: 'rich-text px-5 py-4',
          style: `min-height: ${minRows * 1.5 + 2}rem`,
        },
      },
    });
  }, [editor, id, field, isInvalid, minRows]);

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      Object.fromEntries(
        [...tools.map((t) => t.name), 'link'].map((name) => [name, e?.isActive(name) ?? false]),
      ) as Record<string, boolean>,
  });

  return (
    <div
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      className="field flex w-full flex-col overflow-hidden"
    >
      <div
        role="toolbar"
        aria-label="Formatting"
        className="flex flex-wrap gap-0.5 border-b border-line px-2 py-1.5"
      >
        {tools.map((tool) => (
          <Toggle
            key={tool.name}
            aria-label={tool.label}
            pressed={Boolean(active?.[tool.name])}
            disabled={disabled || !editor}
            // Keep focus (and the selection) in the editor while formatting.
            onMouseDown={(e) => e.preventDefault()}
            onPressedChange={() => editor && tool.run(editor)}
            className={toolbarButton}
          >
            <tool.icon aria-hidden strokeWidth={2} className="size-5" />
          </Toggle>
        ))}
        <span aria-hidden className="mx-1 my-1.5 w-px bg-line" />
        <LinkPopover
          editor={editor}
          active={Boolean(active?.link)}
          disabled={disabled || !editor}
        />
        <button
          type="button"
          aria-label="Insert image"
          disabled={disabled || !editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fileInput.current?.click()}
          className={toolbarButton}
        >
          <ImagePlus aria-hidden strokeWidth={2} className="size-5" />
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = '';
            if (editor && files.length) insertImages(editor, files);
          }}
        />
        <EmojiPopover editor={editor} disabled={disabled || !editor} />
      </div>
      {editor ? (
        <EditorContent
          editor={editor}
          className={clsx(disabled && 'cursor-not-allowed text-ink-disabled')}
        />
      ) : (
        // Same height before the client-only editor mounts, so the layout doesn't jump.
        <div aria-hidden style={{ minHeight: `${minRows * 1.5 + 2}rem` }} />
      )}
    </div>
  );
};

export default RichTextEditor;
