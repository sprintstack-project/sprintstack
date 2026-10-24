import type { ComponentProps } from 'react';

/** Web counterpart of the native Text: a plain span (the font comes from CSS). */
export function Text(props: ComponentProps<'span'>) {
  return <span {...props} />;
}
