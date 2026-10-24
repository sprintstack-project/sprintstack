import { Toggle } from '@base-ui/react/toggle';
import { EMPTY_DOC, sameDoc } from '@lib/rich-text';
import { Placeholder } from '@tiptap/extensions';
import { type Editor, EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useField } from '@ui/Field/Field';
import type { RichTextDoc, RichTextEditorProps } from '@ui/types';
import { clsx } from 'clsx';
import { Bold, Code, Italic, List, ListOrdered, Quote, Strikethrough } from 'lucide-react';
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

export function RichTextEditor({
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  minRows = 5,
  invalid,
  disabled,
}: RichTextEditorProps) {
  const field = useField();
  // The last document we reported. A `value` equal to it is our own echo; anything else is an
  // outside change (like form.reset after data loads) and replaces the content. No `key` hacks.
  const reported = useRef<RichTextDoc | null | undefined>(value ?? defaultValue);
  const callbacks = useRef({ onChange, onBlur });
  callbacks.current = { onChange, onBlur };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Placeholder.configure({ placeholder }),
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
      Object.fromEntries(tools.map((t) => [t.name, e?.isActive(t.name) ?? false])) as Record<
        string,
        boolean
      >,
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
            className={clsx(
              'grid size-9 cursor-pointer place-items-center rounded-md text-ink hover:bg-surface-hover',
              'data-pressed:bg-ink data-pressed:text-on-ink',
              'disabled:cursor-not-allowed disabled:text-ink-disabled disabled:hover:bg-transparent',
              'focus-visible:outline-2 focus-visible:outline-focus-ring',
            )}
          >
            <tool.icon aria-hidden strokeWidth={2} className="size-5" />
          </Toggle>
        ))}
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
}
