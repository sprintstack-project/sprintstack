import { useCSSVariable } from 'uniwind';

/**
 * Reads a colour token (e.g. "ink-muted") for props that take a raw colour, like Lucide's `color`.
 * Native has no colour inheritance, so icons can't pick up the text colour as they do on web.
 */
export const useTokenColor = (token: string): string => {
  const value = useCSSVariable(`--color-${token}`);
  return typeof value === 'string' ? value : '';
};
