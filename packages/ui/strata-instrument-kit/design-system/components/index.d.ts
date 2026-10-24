/**
 * SprintStack Instrument — the shared props contract.
 * Web implements these with Base UI + Tailwind; React Native with native primitives + NativeWind.
 * Feature code imports from `ui/` and never knows which platform it runs on.
 */

/** sm 24px (dense) · md 30px (default desktop) · lg 44px (touch + React Native) */
export type ControlSize = 'sm' | 'md' | 'lg';
export type StatusTone = 'neutral' | 'info' | 'review' | 'success' | 'warning' | 'danger';
/** Shown as P0–P4. */
export type Priority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';
/** A key or chord as displayed, e.g. "C", "/", "⌘K", "⇧S". Wired to aria-keyshortcuts. */
export type Shortcut = string;

interface ControlBase {
  id?: string;
  size?: ControlSize;
  invalid?: boolean;
  disabled?: boolean;
}

export interface Option<V = string> {
  value: V;
  label: string;
  /** Renders a status meter before the label. */
  status?: StatusTone;
  /** 0–4 filled meter segments; defaults from the tone. */
  progress?: number;
  /** Initials or image URL. */
  avatar?: string;
  /** Mono context at the end of the row, e.g. "3 open", "ACTIVE". */
  description?: string;
  disabled?: boolean;
}

export interface CardProps {
  /** "panel" (default) or "issue" (board card). */
  variant?: 'panel' | 'issue';
  title?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  issueKey?: string;
  status?: StatusTone;
  priority?: Priority;
  points?: number;
  assignee?: string;
  labels?: string[];
  /** Countdown string: "T-2D", "today", "2D OVER". */
  due?: string;
  dueState?: 'soon' | 'over';
  /** Draws lime crop marks at the four corners. */
  selected?: boolean;
  onPress?: () => void;
}

export interface FieldProps {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  /** NumberInput only: drag the label horizontally to change the value. */
  scrub?: boolean;
  children: React.ReactNode;
}

export interface InputProps extends ControlBase {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'search' | 'password';
  /** Lucide icon name; "search" for search fields only. */
  leadingIcon?: string;
  /** Mono context before the value, separated by a 1px line: "git:", "https://". */
  prefix?: string;
  /** Set the value in Geist Mono (keys, branches, IDs, URLs). */
  mono?: boolean;
  /** Global key that focuses this field; shown as a kbd hint while empty and unfocused. */
  shortcut?: Shortcut;
  trailing?: React.ReactNode;
}

export interface TextAreaProps extends ControlBase {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Initial rows (default 4); grows to 320px. */
  rows?: number;
  maxLength?: number;
  /** Label for ⌘/Ctrl+Enter in the status bar, e.g. "send", "save". */
  submitHint?: string;
  onSubmit?: () => void;
  /** Show "MD" in the status bar (default true). */
  markdown?: boolean;
}

export interface NumberInputProps extends ControlBase {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Default 1. Shift+Arrow steps ×10. */
  step?: number;
  unit?: string;
  format?: Intl.NumberFormatOptions;
  placeholder?: string;
}

export interface SelectProps<V = string> extends ControlBase {
  options: Option<V>[];
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V | null) => void;
  placeholder?: string;
  /** Opens the select from anywhere. Inside the list, 1–9 pick an option. */
  shortcut?: Shortcut;
  defaultOpen?: boolean;
}

export interface MultiSelectProps<V = string> extends ControlBase {
  options: Option<V>[];
  value?: V[];
  defaultValue?: V[];
  onValueChange?: (value: V[]) => void;
  placeholder?: string;
  /** "neutral" for people, "outline" for labels, "accent" for an active scope. */
  chipTone?: 'neutral' | 'outline' | 'accent';
  creatable?: boolean;
  max?: number;
  loadOptions?: (query: string) => Promise<Option<V>[]>;
  defaultOpen?: boolean;
}

export interface ChipProps {
  children: React.ReactNode;
  tone?: StatusTone | 'outline' | 'accent' | 'key';
  size?: 'sm' | 'md';
  /** With a status tone: render a status meter + word instead of a token. */
  dot?: boolean;
  /** 0–4 filled segments; overrides the tone's default. */
  progress?: number;
  avatar?: string;
  onRemove?: () => void;
  /** Filter segment; place several in a segmented group. */
  toggle?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  count?: number;
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
  /** Past dates count up ("2D OVER") in danger. */
  dueStyle?: boolean;
  /** Opens the picker from anywhere, e.g. "D". */
  shortcut?: Shortcut;
  /** Replace the built-in parser ("fri", "+3d", "next mon", ISO). */
  parse?: (text: string, today: Date) => Date | null;
  defaultOpen?: boolean;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: ControlSize;
  icon?: string;
  /** Shown as a kbd hint and announced via aria-keyshortcuts. */
  shortcut?: Shortcut;
  /** Hide the label visually; it remains the accessible name. */
  iconOnly?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface StatusProps {
  tone: StatusTone;
  progress?: number;
  children?: React.ReactNode;
}

export interface PriorityProps {
  level: Priority;
}

export interface KbdProps {
  children: Shortcut;
}
