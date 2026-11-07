import {
  CoreBridge,
  type EditorBridge,
  LinkBridge,
  PlaceholderBridge,
  RichText,
  TenTapStartKit,
  useBridgeState,
  useEditorBridge,
} from '@10play/tentap-editor';
import { fieldShell } from '@lib/field-shell.native';
import {
  EMPTY_DOC,
  linksToMentions,
  mentionLink,
  mentionsToLinks,
  normalizeHref,
  sameDoc,
} from '@lib/rich-text';
import { scaled, UI_SCALE } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useTokenColor } from '@lib/use-token-color.native';
import Button from '@ui/button';
import Field, { useField } from '@ui/field';
import Input from '@ui/input';
import MentionSheet from '@ui/rich-text-editor/mention-sheet';
import type { MentionItem, RichTextDoc, RichTextEditorProps } from '@ui/types';
import { clsx } from 'clsx';
import { launchImageLibraryAsync } from 'expo-image-picker';
import {
  AtSign,
  Bold,
  Code,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  type LucideIcon,
  Quote,
  Strikethrough,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
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
  c: Record<'ink' | 'muted' | 'placeholder' | 'line' | 'link' | 'code' | 'focus', string>,
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
    .ProseMirror a[href^="mention:"] { text-decoration: none; background: ${c.code};
      border-radius: ${px(6)}; padding: 0.05em 0.3em;
      -webkit-box-decoration-break: clone; box-decoration-break: clone; }
    .ProseMirror img { display: block; max-width: 100%; height: auto; border-radius: ${px(12)}; }
    .ProseMirror img.ProseMirror-selectednode { outline: 2px solid ${c.focus}; outline-offset: 2px; }
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
  uploadImage,
  searchMentions,
  invalid,
  disabled,
}: RichTextEditorProps) => {
  const field = useField();
  const reported = useRef<RichTextDoc | null | undefined>(value ?? defaultValue);
  const callbacks = useRef({ onChange, onBlur });
  callbacks.current = { onChange, onBlur };
  const linkSheet = useRef<SheetRef>(null);
  const mentionSheet = useRef<SheetRef>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const colors = {
    ink: useTokenColor('ink'),
    muted: useTokenColor('ink-muted'),
    placeholder: useTokenColor('ink-placeholder'),
    line: useTokenColor('line-strong'),
    link: useTokenColor('brand-ink'),
    code: useTokenColor('surface-muted'),
    focus: useTokenColor('focus-ring'),
  };
  const iconInk = useTokenColor('ink');
  const iconOnInk = useTokenColor('on-ink');
  const iconOff = useTokenColor('ink-disabled');

  const editor = useEditorBridge({
    initialContent: mentionsToLinks(value ?? defaultValue ?? EMPTY_DOC) as object,
    editable: !disabled,
    dynamicHeight: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(contentCSS(colors)),
      PlaceholderBridge.configureExtension({ placeholder }),
      // Mentions are `mention:` links here (see mentionsToLinks); keep their href on the page.
      LinkBridge.configureExtension({ protocols: ['mention'] }),
    ],
    onChange: async () => {
      const doc = linksToMentions((await editor.getJSON()) as RichTextDoc);
      reported.current = doc;
      callbacks.current.onChange?.(doc);
    },
  });
  const state = useBridgeState(editor);

  // Outside changes (a form reset after data loads) replace the content; our own echoes don't.
  useEffect(() => {
    if (!state.isReady || value === undefined || sameDoc(value, reported.current)) return;
    reported.current = value;
    editor.setContent(mentionsToLinks(value ?? EMPTY_DOC) as object);
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

  // A mention is a link underneath; the link tool leaves it alone.
  const onLink = state.isLinkActive && !state.activeLink?.startsWith('mention:');

  // A sheet's input takes focus from the WebView; put the selection back before editing.
  const savedSelection = useRef(state.selection);
  const restoreSelection = () => {
    const { from, to } = savedSelection.current;
    editor.setSelection(from, to);
    return from === to;
  };
  const openLink = () => {
    savedSelection.current = state.selection;
    setLinkUrl(onLink ? (state.activeLink ?? '') : '');
    linkSheet.current?.show();
  };
  const applyLink = (url: string) => {
    linkSheet.current?.hide();
    const empty = restoreSelection();
    const href = normalizeHref(url);
    if (href && empty && !onLink) {
      editor.insertContent({
        type: 'text',
        text: url.trim(),
        marks: [{ type: 'link', attrs: { href } }],
      });
    } else editor.setLink(href);
  };

  const openMention = () => {
    savedSelection.current = state.selection;
    mentionSheet.current?.show();
  };
  const insertMention = (item: MentionItem) => {
    restoreSelection();
    editor.insertContent([mentionLink(item.id, item.label), { type: 'text', text: ' ' }]);
  };

  // Uploads the picked photo, or embeds it as a data URL.
  const pickImage = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: !uploadImage,
    });
    const asset = result.assets?.[0];
    if (result.canceled || !asset) return;
    const src = uploadImage
      ? await uploadImage(await (await fetch(asset.uri)).blob())
      : `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`;
    editor.setImage(src);
  };

  const off = disabled || !state.isReady;
  const toolButton = (label: string, Icon: LucideIcon, on: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on, disabled: off }}
      disabled={off}
      onPress={onPress}
      className={clsx(
        'size-9 items-center justify-center rounded-md',
        on ? 'bg-ink' : 'active:bg-surface-pressed',
      )}
    >
      <Icon
        aria-hidden
        size={scaled(20)}
        strokeWidth={2}
        color={off ? iconOff : on ? iconOnInk : iconInk}
      />
    </Pressable>
  );

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
        {tools.map((tool) =>
          toolButton(tool.label, tool.icon, tool.active(state), () => tool.run(editor)),
        )}
        <View aria-hidden className="mx-1 my-1.5 w-px bg-line" />
        {toolButton('Link', Link, onLink, openLink)}
        {searchMentions && toolButton('Mention someone', AtSign, false, openMention)}
        {toolButton('Insert image', ImagePlus, false, pickImage)}
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
      <Sheet sheetRef={linkSheet} title="Link">
        <View className="gap-4 px-4">
          <Field label="Link address">
            <Input
              type="url"
              value={linkUrl}
              onChange={setLinkUrl}
              placeholder="E.g. example.com"
            />
          </Field>
          <View className="flex-row justify-end gap-2">
            {onLink && (
              <Button variant="ghost" size="sm" onClick={() => applyLink('')}>
                Remove link
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => applyLink(linkUrl)}>
              {onLink ? 'Update' : 'Add link'}
            </Button>
          </View>
        </View>
      </Sheet>
      {searchMentions && (
        <MentionSheet sheetRef={mentionSheet} search={searchMentions} onPick={insertMention} />
      )}
    </View>
  );
};

export default RichTextEditor;
