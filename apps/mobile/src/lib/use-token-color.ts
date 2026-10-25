import { useCSSVariable } from 'uniwind';

/** A colour token (e.g. "ink-muted") as a raw value, for Lucide's `color` prop. */
export const useTokenColor = (token: string): string => {
  const value = useCSSVariable(`--color-${token}`);
  return typeof value === 'string' ? value : '';
};
