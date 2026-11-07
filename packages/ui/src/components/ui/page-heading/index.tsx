import Eyebrow from '@ui/eyebrow';
import type { PageHeadingProps } from '@ui/types';

const PageHeading = ({ eyebrow, title, accent }: PageHeadingProps) => (
  <div className="flex flex-col gap-2">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h1 className="headline text-7xl leading-none text-ink">
      {title}
      {accent && <span className="text-brand-ink"> {accent}</span>}
    </h1>
  </div>
);

export default PageHeading;
