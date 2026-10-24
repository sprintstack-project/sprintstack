import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Equal,
  Flag,
  type LucideIcon,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Target,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { cn } from '../../../lib/cn';

// Props take icon names as strings (see index.d.ts), so every icon we use is registered here.
// Keys are Lucide's kebab-case names, plus the short names the reference previews use.
const icons: Record<string, LucideIcon> = {
  'arrow-down': ArrowDown,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  bookmark: Bookmark,
  calendar: Calendar,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-alert': CircleAlert,
  clock: Clock,
  equal: Equal,
  flag: Flag,
  minus: Minus,
  plus: Plus,
  'rotate-ccw': RotateCcw,
  search: Search,
  target: Target,
  'trash-2': Trash2,
  user: User,
  x: X,
  // Reference aliases
  alert: CircleAlert,
  arrow: ArrowRight,
  down: ArrowDown,
  lines: Equal,
  points: Target,
  sprint: RotateCcw,
  trash: Trash2,
  up: ArrowUp,
};

export interface IconProps {
  name: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Icon({ name, size = 'md', className }: IconProps) {
  const Component = icons[name];
  if (!Component) {
    console.warn(`Icon "${name}" is not registered in Icon.tsx`);
    return null;
  }
  return (
    <Component
      aria-hidden
      strokeWidth={2}
      className={cn('shrink-0', size === 'sm' ? 'size-[18px]' : 'size-6', className)}
    />
  );
}
