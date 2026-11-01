import type { EyebrowProps } from '@ui/types';

const Eyebrow = ({ children, heading }: EyebrowProps) =>
  heading ? <h2 className="eyebrow">{children}</h2> : <p className="eyebrow">{children}</p>;

export default Eyebrow;
