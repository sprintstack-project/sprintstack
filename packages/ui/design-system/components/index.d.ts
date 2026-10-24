/**
 * Strata Bold — the shared props contract.
 * Web implements these with Base UI + Tailwind; React Native with native primitives + NativeWind.
 * Same component names and core props as Strata (Ledger) and Strata Instrument.
 */

/** Inputs are always 56px. Buttons: sm 40 · md 48 · lg 56. */
export type ControlSize = 'sm' | 'md' | 'lg';
export type StatusTone = 'neutral' | 'info' | 'review' | 'success' | 'warning' | 'danger';
export type Priority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

interface ControlBase {
  id?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
}

export interface Option<V = string> {
  value: V;
  /** Optional when `status` is set (the badge is the label). */
  label?: string;
  /** Lucide icon name shown on the left of the row. */
  icon?: string;
  /** Render the option as a status badge. */
  status?: StatusTone;
  avatar?: string;
  description?: string;
  disabled?: boolean;
  /** Destructive row in brand-ink; place it last. */
  danger?: boolean;
  /** Run an action instead of selecting a value ("Clear this view"). */
  action?: () => void;
}

export interface CardProps {
  /** "panel" (default), "issue" (board card) or "tile" (solid poster tile). */
  variant?: 'panel' | 'issue' | 'tile';
  title?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Tile: brand (red), ink (black; white in Night) or muted (grey). */
  tone?: 'brand' | 'ink' | 'muted';
  /** Tile: uppercase overline. */
  eyebrow?: string;
  issueKey?: string;
  /** Issue: shows a status badge in place of the key. */
  status?: StatusTone;
  /** Issue: subline after the key, e.g. "Payments · iOS". */
  project?: string;
  priority?: Priority;
  points?: number;
  /** Issue: e.g. "Due 30 Oct", "2 days overdue". */
  due?: string;
  overdue?: boolean;
  /** Issue: 0–100; replaces the meta row and footer with a red progress bar. */
  progress?: number;
  assignee?: string;
  /** Issue: e.g. "Updated 2h ago". Shown top-right when status is set; in the footer otherwise. */
  updated?: string;
  age?: string;
  watched?: boolean;
  selected?: boolean;
  /** Issue: footer link text (default "View issue"). */
  linkLabel?: string;
  onPress?: () => void;
}

export interface FieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends ControlBase {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** An example, e.g. "E.g. checkout bug". Never the label. */
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'search' | 'password';
  leadingIcon?: string;
  trailing?: React.ReactNode;
  /** Full-pill search bar; pair with a brand Button as `trailing`. */
  pill?: boolean;
}

export interface TextAreaProps extends ControlBase {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export interface NumberInputProps extends ControlBase {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface SelectProps<V = string> extends ControlBase {
  options: Option<V>[];
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V | null) => void;
  placeholder?: string;
  defaultOpen?: boolean;
}

export interface MultiSelectProps<V = string> extends ControlBase {
  options: Option<V>[];
  value?: V[];
  defaultValue?: V[];
  onValueChange?: (value: V[]) => void;
  placeholder?: string;
  /** "ink" (default, black pills) or "neutral" (grey pills). */
  chipTone?: 'ink' | 'neutral' | 'outline';
  creatable?: boolean;
  max?: number;
  loadOptions?: (query: string) => Promise<Option<V>[]>;
  defaultOpen?: boolean;
}

export interface ChipProps {
  children: React.ReactNode;
  /** Value pills: neutral | ink | outline | accent | key. With `dot`: a status tone. */
  tone?: StatusTone | 'ink' | 'outline' | 'accent' | 'key';
  size?: 'sm' | 'md';
  /** With a status tone: render an uppercase status badge. */
  dot?: boolean;
  avatar?: string;
  onRemove?: () => void;
  /** Filter pill: outline, filled ink when pressed. */
  toggle?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  count?: number;
}

export interface BadgeProps {
  tone: StatusTone;
  /** Defaults to the tone's word (TO DO, IN PROGRESS, IN REVIEW, DONE, BLOCKED, AT RISK); "New" for fresh items. */
  children?: React.ReactNode;
}

export interface PriorityProps {
  level: Priority;
}

export interface DatePickerProps extends ControlBase {
  /** ISO date (YYYY-MM-DD). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1 | 6;
  /** Past dates read "· Overdue" in red. */
  dueStyle?: boolean;
  /** Open on the day grid or the 4×3 month-pill grid. */
  defaultView?: 'days' | 'months';
  defaultOpen?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  /** primary = ink pill · brand = red pill · secondary = ink outline · danger = red outline · ghost · link = red underlined text */
  variant?: 'primary' | 'brand' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: ControlSize;
  icon?: string;
  iconEnd?: string;
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
