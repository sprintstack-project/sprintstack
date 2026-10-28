import {
  CoreBridge,
  type EditorBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
} from '@10play/tentap-editor';
import { fieldShell } from '@lib/field-shell.native';
import { EMPTY_DOC, sameDoc } from '@lib/rich-text';
import { scaled, UI_SCALE } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/field';
import type { RichTextDoc, RichTextEditorProps } from '@ui/types';
import { clsx } from 'clsx';
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Quote,
  Strikethrough,
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';

type BridgeState = ReturnType<typeof useBridgeState>;

const tools: {
  label: string;
  icon: LucideIcon;
  active: (s: BridgeState) => boolean;
  run: (e: EditorBridge) => void;
}[] = [
  { label: 'Bold', icon: Bold, active: (s) => s.isBoldActive, run: (e) => e.toggleBold() },
  { label: 'Italic', icon: Italic, active: (s) => s.isItalicActive, run: (e) => e.toggleItalic() },
  {
    label: 'Strikethrough',
    icon: Strikethrough,
    active: (s) => s.isStrikeActive,
    run: (e) => e.toggleStrike(),
  },
  { label: 'Inline code', icon: Code, active: (s) => s.isCodeActive, run: (e) => e.toggleCode() },
  {
    label: 'Bulleted list',
    icon: List,
    active: (s) => s.isBulletListActive,
    run: (e) => e.toggleBulletList(),
  },
  {
    label: 'Numbered list',
    icon: ListOrdered,
    active: (s) => s.isOrderedListActive,
    run: (e) => e.toggleOrderedList(),
  },
  {
    label: 'Quote',
    icon: Quote,
    active: (s) => s.isBlockquoteActive,
    run: (e) => e.toggleBlockquote(),
  },
];

/** The same content styles as web's `rich-text` utility, injected into 10tap's WebView. */
const contentCSS = (
  c: Record<'ink' | 'muted' | 'placeholder' | 'line' | 'link' | 'code', string>,
) => {
  const px = (n: number) => `${n * UI_SCALE}px`;
  return `
    * { background: transparent; }
    body, .ProseMirror { font-family: -apple-system, system-ui, sans-serif; font-size: ${px(17)};
      line-height: ${px(24)}; color: ${c.ink}; padding: 0; margin: 0; }
    .ProseMirror > * + * { margin-top: ${px(12)}; }
    .ProseMirror p { margin: 0; }
    .ProseMirror ul, .ProseMirror ol { padding-left: ${px(24)}; margin: 0; }
    .ProseMirror blockquote { border-left: 3px solid ${c.line}; padding-left: ${px(16)}; color: ${c.muted}; margin: 0; }
    .ProseMirror code { font-family: Menlo, monospace; font-size: 0.9em; background: ${c.code};
      border-radius: ${px(6)}; padding: 0.1em 0.35em; }
    .ProseMirror a { color: ${c.link}; font-weight: 700; }
    .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder);
      color: ${c.placeholder}; float: left; height: 0; pointer-events: none; }
  `;
};

const RichTextEditor = ({
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  minRows = 5,
  invalid,
  disabled,
}: RichTextEditorProps) => {
  const field = useField();
  const reported = useRef<RichTextDoc | null | undefined>(value ?? defaultValue);
  const callbacks = useRef({ onChange, onBlur });
  callbacks.current = { onChange, onBlur };

  const colors = {
    ink: useTokenColor('ink'),
    muted: useTokenColor('ink-muted'),
    placeholder: useTokenColor('ink-placeholder'),
    line: useTokenColor('line-strong'),
    link: useTokenColor('brand-ink'),
    code: useTokenColor('surface-muted'),
  };
  const iconInk = useTokenColor('ink');
  const iconOnInk = useTokenColor('on-ink');
  const iconOff = useTokenColor('ink-disabled');

  const editor = useEditorBridge({
    initialContent: (value ?? defaultValue ?? EMPTY_DOC) as object,
    editable: !disabled,
    dynamicHeight: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(contentCSS(colors)),
      PlaceholderBridge.configureExtension({ placeholder }),
    ],
    onChange: async () => {
      const doc = (await editor.getJSON()) as RichTextDoc;
      reported.current = doc;
      callbacks.current.onChange?.(doc);
    },
  });
  const state = useBridgeState(editor);

  // Outside changes (a form reset after data loads) replace the content; our own echoes don't.
  useEffect(() => {
    if (!state.isReady || value === undefined || sameDoc(value, reported.current)) return;
    reported.current = value;
    editor.setContent((value ?? EMPTY_DOC) as object);
  }, [editor, state.isReady, value]);

  // Re-style the WebView when the theme flips (the CSS above is only read at creation).
  const css = contentCSS(colors);
  useEffect(() => {
    if (state.isReady) editor.injectCSS(css, 'SprintStack-theme');
  }, [editor, state.isReady, css]);

  // Report blur on the focused -> unfocused edge, for validate-on-blur.
  const wasFocused = useRef(false);
  useEffect(() => {
    if (wasFocused.current && !state.isFocused) callbacks.current.onBlur?.();
    wasFocused.current = state.isFocused;
  }, [state.isFocused]);

  return (
    <View
      className={fieldShell(
        { focused: state.isFocused, invalid: invalid || field?.invalid, disabled },
        'overflow-hidden',
      )}
    >
      <View
        accessibilityRole="toolbar"
        className="flex-row flex-wrap gap-0.5 border-b border-line px-2 py-1.5"
      >
        {tools.map((tool) => {
          const on = tool.active(state);
          const off = disabled || !state.isReady;
          return (
            <Pressable
              key={tool.label}
              accessibilityRole="button"
              accessibilityLabel={tool.label}
              accessibilityState={{ selected: on, disabled: off }}
              disabled={off}
              onPress={() => tool.run(editor)}
              className={clsx(
                'size-9 items-center justify-center rounded-md',
                on ? 'bg-ink' : 'active:bg-surface-pressed',
              )}
            >
              <tool.icon
                aria-hidden
                size={scaled(20)}
                strokeWidth={2}
                color={off ? iconOff : on ? iconOnInk : iconInk}
              />
            </Pressable>
          );
        })}
      </View>
      <View className="px-5 py-4" style={{ minHeight: scaled(minRows * 24) }}>
        <RichText
          editor={editor}
          accessibilityLabel={field?.label}
          // WebViews paint an opaque white page; the CSS can't reach it, so clear it here.
          style={{ backgroundColor: 'transparent' }}
          containerStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    </View>
  );
};

export default RichTextEditor;
