import type { SelectProps } from '@ui/types';
import type { ReactNode } from 'react';

/**
 * Internal: opens a Select from another component's own trigger, like Sidebar's project and
 * account switchers. Not part of SelectProps; form fields always use the field trigger.
 */
export interface CustomTrigger {
  /** The trigger's accessible name; also names the search box (web) and titles the sheet (native). */
  label: string;
  className: string;
  children: ReactNode;
  /** Web: where the menu opens. Native always uses the bottom sheet. */
  side?: 'top' | 'bottom' | 'right';
  align?: 'start' | 'end';
  /** Native: extra touch area around a trigger drawn smaller than 44pt. */
  hitSlop?: number;
}

export type SelectWithTriggerProps<V> = SelectProps<V> & {
  trigger?: CustomTrigger;
};
