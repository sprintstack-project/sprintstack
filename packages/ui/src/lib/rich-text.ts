import type { RichTextDoc, RichTextNode } from '@ui/types';

export const EMPTY_DOC: RichTextDoc = { type: 'doc', content: [{ type: 'paragraph' }] };

/** Same document? Used to tell an outside change (a form reset) from the editor's own echo. */
export const sameDoc = (a: RichTextDoc | null | undefined, b: RichTextDoc | null | undefined) =>
  JSON.stringify(a ?? EMPTY_DOC) === JSON.stringify(b ?? EMPTY_DOC);

const BLOCKS = new Set(['paragraph', 'heading', 'blockquote', 'codeBlock', 'listItem', 'taskItem']);

/** Plain text of a document, one line per block: for search, notifications and previews. */
export const richTextToPlainText = (doc: RichTextDoc | null | undefined): string => {
  const lines: string[] = [];
  let line = '';
  const walk = (node: RichTextNode) => {
    if (node.type === 'text') line += node.text ?? '';
    else if (node.type === 'mention') line += `@${node.attrs?.label ?? node.attrs?.id ?? ''}`;
    else if (node.type === 'hardBreak') line += '\n';
    node.content?.forEach(walk);
    if (BLOCKS.has(node.type) && !node.content?.some((c) => BLOCKS.has(c.type))) {
      lines.push(line);
      line = '';
    }
  };
  doc?.content?.forEach(walk);
  return lines.join('\n').trim();
};

/** True when a document has no visible text (e.g. for a required description). */
export const isRichTextEmpty = (doc: RichTextDoc | null | undefined) =>
  richTextToPlainText(doc) === '';

/** An image as a data URL, for editors with no `uploadImage`. */
export const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/** A typed link as an href: "example.com" → "https://example.com"; mailto:, tel: and paths kept. */
export const normalizeHref = (input: string) => {
  const href = input.trim();
  if (!href || /^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('/') || href.startsWith('#'))
    return href;
  return href.includes('@') && !href.includes('/') ? `mailto:${href}` : `https://${href}`;
};

/*
 * Native mentions. 10tap's prebuilt editor has no `mention` node, so on native a mention is the
 * text "@Name" linked to `mention:<id>`. These convert at the editor's edge, so stored documents
 * hold `mention` nodes on both platforms.
 */
const MENTION_HREF = 'mention:';

/** A mention as native shows it: "@Name", linked to `mention:<id>`. */
export const mentionLink = (id: string, label: string): RichTextNode => ({
  type: 'text',
  text: `@${label}`,
  marks: [{ type: 'link', attrs: { href: `${MENTION_HREF}${encodeURIComponent(id)}` } }],
});

const mapContent = (
  node: RichTextNode,
  map: (content: RichTextNode[]) => RichTextNode[],
): RichTextNode =>
  node.content ? { ...node, content: map(node.content.map((c) => mapContent(c, map))) } : node;

/** Mention nodes → linked "@Name" text, before a document goes into the native editor. */
export const mentionsToLinks = (doc: RichTextDoc): RichTextDoc =>
  mapContent(doc, (content) =>
    content.map((node) =>
      node.type === 'mention'
        ? mentionLink(
            String(node.attrs?.id ?? ''),
            String(node.attrs?.label ?? node.attrs?.id ?? ''),
          )
        : node,
    ),
  ) as RichTextDoc;

const mentionId = (node: RichTextNode) => {
  const href = node.marks?.find((m) => m.type === 'link')?.attrs?.href;
  return typeof href === 'string' && href.startsWith(MENTION_HREF)
    ? decodeURIComponent(href.slice(MENTION_HREF.length))
    : null;
};

/**
 * Linked "@Name" text → mention nodes, as the native editor reports a document. Neighbouring
 * pieces of one mention (split by bold, say) join up; one edited down to "@" turns back into text.
 */
export const linksToMentions = (doc: RichTextDoc): RichTextDoc =>
  mapContent(doc, (content) => {
    const out: RichTextNode[] = [];
    for (const node of content) {
      const id = node.type === 'text' ? mentionId(node) : null;
      if (id === null) {
        out.push(node);
        continue;
      }
      const prev = out[out.length - 1];
      const text = node.text ?? '';
      if (prev?.type === 'mention' && prev.attrs?.id === id && !text.startsWith('@')) {
        prev.attrs = { ...prev.attrs, label: `${prev.attrs.label}${text}` };
        continue;
      }
      out.push({
        type: 'mention',
        attrs: { id, label: text.replace(/^@/, ''), mentionSuggestionChar: '@' },
      });
    }
    return out.flatMap((node) =>
      node.type === 'mention' && !String(node.attrs?.label ?? '').trim()
        ? [{ type: 'text', text: '@' }]
        : [node],
    );
  }) as RichTextDoc;
