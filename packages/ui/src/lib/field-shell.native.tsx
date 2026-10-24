import { scaled } from '@lib/scale';
import { twMerge } from '@lib/tw-merge';
import { type ClassValue, clsx } from 'clsx';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

interface ShellState {
  focused?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

/**
 * Native version of the web `field` utility: the 56px shell around inputs, selects and pickers.
 * Native has no :focus-within, so components pass their own focus state.
 */
export function fieldShell({ focused, invalid, disabled }: ShellState, ...classes: ClassValue[]) {
  return twMerge(
    clsx(
      'min-h-14 rounded-lg border-[1.5px] border-line-strong bg-surface',
      focused && 'border-ink',
      invalid && 'border-brand',
      disabled && 'border-line bg-surface-muted',
      ...classes,
    ),
  );
}

const FORWARD_REF = Symbol.for('react.forward_ref');

/**
 * Gives slot icons the field's muted colour (web gets it by inheritance) and the scaled icon size.
 * Lucide icons are forwardRef components; plain components such as our Button are left alone, as
 * are props the element already sets.
 */
export function tintSlot(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node) || (node.type as { $$typeof?: symbol }).$$typeof !== FORWARD_REF)
    return node;
  const element = node as ReactElement<{ color?: string; size?: number }>;
  return cloneElement(element, {
    color: element.props.color ?? color,
    size: element.props.size ?? scaled(24),
  });
}
