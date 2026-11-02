import { z } from 'zod';

interface Node {
  type: string;
  text?: string;
  content?: Node[];
}

/** Text, or a mention (which reads as "@Name"). */
const hasText = (node: Node): boolean =>
  (node.type === 'text' && Boolean(node.text?.trim())) ||
  node.type === 'mention' ||
  Boolean(node.content?.some(hasText));

/** A Tiptap JSON document, as written by RichTextEditor on web (Tiptap) and native (10tap-editor). */
export const richTextDoc = z.object({
  type: z.literal('doc'),
  content: z.array(z.any()).optional(),
});

/** A document with at least some visible text. */
export const richTextRequired = (message: string) =>
  richTextDoc.refine((doc) => hasText(doc as Node), { message });
