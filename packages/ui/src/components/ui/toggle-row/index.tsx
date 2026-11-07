import Switch from '@ui/switch';
import type { ToggleRowProps } from '@ui/types';

const ToggleRow = ({ title, description, checked, onCheckedChange, children }: ToggleRowProps) => (
  <div className="flex flex-col gap-4 border-t border-line py-6 last:pb-0">
    <div className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 flex-col gap-1 font-stretch-semi-condensed">
        <p className="text-[1.0625rem] leading-6 font-bold text-ink">{title}</p>
        <p className="text-[1.0625rem] leading-6 text-ink-muted">{description}</p>
      </div>
      <Switch label={title} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
    {children}
  </div>
);

export default ToggleRow;
