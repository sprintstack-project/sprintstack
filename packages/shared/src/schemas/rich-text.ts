import { z } from 'zod';

interface Node {
  type: string;
  text?: string;
  content?: Node[];
}

const hasText = (node: Node): boolean =>
  (node.type === 'text' && Boolean(node.text?.trim())) || Boolean(node.content?.some(hasText));

/** A Tiptap JSON document, as written by RichTextEditor on web (Tiptap) and native (10tap-editor). */
export const richTextDoc = z.object({
  type: z.literal('doc'),
  content: z.array(z.any()).optional(),
});

/** A document with at least some visible text. */
export const richTextRequired = (message: string) =>
  richTextDoc.refine((doc) => hasText(doc as Node), { message });
