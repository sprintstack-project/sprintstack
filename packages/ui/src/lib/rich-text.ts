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
