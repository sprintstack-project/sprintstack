// The props contract lives in design-system/components/index.d.ts. Web and native both import from here.
import type { ComponentType, ReactNode } from 'react';
import type {
  ButtonProps as ContractButtonProps,
  DatePickerProps as ContractDatePickerProps,
  InputProps as ContractInputProps,
  MultiSelectProps as ContractMultiSelectProps,
  NumberInputProps as ContractNumberInputProps,
  Option as ContractOption,
  SelectProps as ContractSelectProps,
  TextAreaProps as ContractTextAreaProps,
  ControlSize,
} from '../../../design-system/components/index';

export type {
  BadgeProps,
  CardProps,
  ChipProps,
  ControlSize,
  FieldProps,
  Priority,
  PriorityProps,
  StatusTone,
} from '../../../design-system/components/index';

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

/**
 * Every form control reports when the person leaves it, so forms can validate on blur.
 * Popup controls (Select, MultiSelect, DatePicker) blur when their menu, sheet or calendar closes.
 */
interface Blurrable {
  onBlur?: () => void;
}

// The contract types `icon` / `iconEnd` as Lucide icon names; we take the components instead.
export interface ButtonProps extends Omit<ContractButtonProps, 'icon' | 'iconEnd'> {
  icon?: IconComponent;
  iconEnd?: IconComponent;
}

export interface InputSlots {
  /** Before the text: usually a muted icon, e.g. <Search />. */
  left?: ReactNode;
  /** After the text: an icon, a unit, or an action such as a clear or "Search" button. */
  right?: ReactNode;
}

// The contract's `leadingIcon` (icon name) and `trailing` become free-form slots on either side.
export interface InputProps
  extends Omit<ContractInputProps, 'leadingIcon' | 'trailing'>,
    Blurrable {
  slots?: InputSlots;
}

export interface TextAreaProps extends ContractTextAreaProps, Blurrable {}

export interface NumberInputProps extends ContractNumberInputProps, Blurrable {}

export interface DatePickerProps extends ContractDatePickerProps, Blurrable {}

// Options take an icon component too (`icon: Flag`), not a Lucide name.
export interface Option<V = string> extends Omit<ContractOption<V>, 'icon'> {
  icon?: IconComponent;
}

export interface SelectProps<V = string>
  extends Omit<ContractSelectProps<V>, 'options'>,
    Blurrable {
  options: Option<V>[];
  /**
   * Adds a search box to the menu and virtualizes the rows, for long lists (people, projects,
   * components). Plain selects are for short, fixed lists and aren't virtualized.
   */
  searchable?: boolean;
}

export interface MultiSelectProps<V = string>
  extends Omit<ContractMultiSelectProps<V>, 'options' | 'loadOptions'>,
    Blurrable {
  options: Option<V>[];
  loadOptions?: (query: string) => Promise<Option<V>[]>;
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

/** Not in the design-system contract: added for issue descriptions and comments. */
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
