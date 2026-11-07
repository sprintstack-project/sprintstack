/**
 * Tag for a story's usage snippet (`parameters.docs.source.code`), shown in the docs page and the
 * Code panel. Write the snippet indented with the story; this strips the shared indentation and the
 * blank first and last lines so it reads as it would in a file.
 */
export const code = (strings: TemplateStringsArray, ...values: unknown[]) => {
  // Cooked strings, so escaped backticks and \${ read as written in the snippet.
  const raw = strings.reduce(
    (all, part, i) => all + part + (i < values.length ? values[i] : ''),
    '',
  );
  const lines = raw
    .replace(/^\s*\n/, '')
    .replace(/\n\s*$/, '')
    .split('\n');
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)?.[0].length ?? 0),
  );
  return lines.map((line) => line.slice(indent)).join('\n');
};
