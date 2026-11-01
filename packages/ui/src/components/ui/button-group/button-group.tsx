import type { ButtonGroupProps } from '@ui/types';

const ButtonGroup = ({ children }: ButtonGroupProps) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

export default ButtonGroup;
