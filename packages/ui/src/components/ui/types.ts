// The props contract for every component. Web and native both import from here.
import type { ComponentType, ReactNode } from 'react';

/** Inputs are always 56px. Buttons: sm 40 · md 48 · lg 56. */
export type ControlSize = 'sm' | 'md' | 'lg';
export type StatusTone = 'neutral' | 'info' | 'review' | 'success' | 'warning' | 'danger';
export type Priority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

/**
 * An icon component imported straight from lucide-react (web) or lucide-react-native (native),
 * e.g. `icon={Plus}`. Components set the 24px size and 2px stroke (and, on native, the colour).
 */
export type IconComponent = ComponentType<{
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
  'aria-hidden'?: boolean;
}>;

interface ControlBase {
  id?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
}

/**
 * Every form control reports when the person leaves it, so forms can validate on blur.
 * Popup controls (Select, MultiSelect, DatePicker) blur when their menu, sheet or calendar closes.
 */
interface Blurrable {
  onBlur?: () => void;
}

export interface ButtonProps {
  children: ReactNode;
  /** primary = ink pill · brand = brand pill · secondary = ink outline · danger = outline · ghost · link = underlined text */
  variant?: 'primary' | 'brand' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: ControlSize;
  icon?: IconComponent;
  iconEnd?: IconComponent;
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface CardProps {
  /** "panel" (default), "issue" (board card) or "tile" (solid poster tile). */
  variant?: 'panel' | 'issue' | 'tile';
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** Tile: brand, ink (inverts in Night) or muted (grey). */
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
  /** Issue: 0–100; replaces the meta row and footer with a progress bar. */
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
  children: ReactNode;
}

export interface InputSlots {
  /** Before the text: usually a muted icon, e.g. <Search />. */
  left?: ReactNode;
  /** After the text: an icon, a unit, or an action such as a clear or "Search" button. */
  right?: ReactNode;
}

export interface InputProps extends ControlBase, Blurrable {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** An example, e.g. "E.g. checkout bug". Never the label. */
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'search' | 'password';
  /** Content on either side of the text: icons, units or labelled action buttons. */
  slots?: InputSlots;
  /** Full-pill search bar; pair with a brand Button in `slots.right`. */
  pill?: boolean;
}

export interface TextAreaProps extends ControlBase, Blurrable {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export interface NumberInputProps extends ControlBase, Blurrable {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface DatePickerProps extends Blurrable {
  id?: string;
  /** ISO date (YYYY-MM-DD). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1 | 6;
  /** Past dates read "· Overdue". */
  dueStyle?: boolean;
  /** Open on the day grid or the 4×3 month-pill grid. */
  defaultView?: 'days' | 'months';
  defaultOpen?: boolean;
  invalid?: boolean;
  disabled?: boolean;
}

export interface Option<V = string> {
  value: V;
  /** Optional when `status` is set (the badge is the label). */
  label?: string;
  /** Icon on the left of the row, e.g. `icon: Flag`. */
  icon?: IconComponent;
  /** Render the option as a status badge. */
  status?: StatusTone;
  avatar?: string;
  description?: string;
  disabled?: boolean;
  /** Destructive row; place it last. */
  danger?: boolean;
  /** Run an action instead of selecting a value ("Clear this view"). */
  action?: () => void;
}

export interface SelectProps<V = string> extends ControlBase, Blurrable {
  options: Option<V>[];
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V | null) => void;
  placeholder?: string;
  defaultOpen?: boolean;
  /**
   * Adds a search box to the menu and virtualizes the rows, for long lists (people, projects,
   * components). Plain selects are for short, fixed lists and aren't virtualized.
   */
  searchable?: boolean;
}

export interface MultiSelectProps<V = string> extends ControlBase, Blurrable {
  options: Option<V>[];
  value?: V[];
  defaultValue?: V[];
  onValueChange?: (value: V[]) => void;
  placeholder?: string;
  /** "ink" (default, filled pills), "neutral" (grey pills) or "outline". */
  chipTone?: 'ink' | 'neutral' | 'outline';
  creatable?: boolean;
  max?: number;
  loadOptions?: (query: string) => Promise<Option<V>[]>;
  defaultOpen?: boolean;
}

export interface ChipProps {
  children: ReactNode;
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
  children?: ReactNode;
}

export interface PriorityProps {
  level: Priority;
}

/**
 * A rich-text document as Tiptap JSON: the same format on web (Tiptap) and native (10tap-editor),
 * so a description written on a phone opens unchanged in the browser.
 */
export interface RichTextDoc {
  type: 'doc';
  content?: RichTextNode[];
}

export interface RichTextNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

/** Added for issue descriptions and comments. */
export interface RichTextEditorProps extends Blurrable {
  id?: string;
  /**
   * The document. The editor keeps its own state while you type; a `value` that differs from the
   * last one it reported (e.g. a form reset after data loads) replaces the content. No `key` needed.
   */
  value?: RichTextDoc | null;
  defaultValue?: RichTextDoc | null;
  onChange?: (value: RichTextDoc) => void;
  placeholder?: string;
  /** Minimum height in text lines (default 5). */
  minRows?: number;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
}
