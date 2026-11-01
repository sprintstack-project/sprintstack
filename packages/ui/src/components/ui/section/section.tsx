import type { SectionProps } from '@ui/types';

const Section = ({ title, description, children }: SectionProps) => (
  <section className="flex flex-col gap-8 rounded-3xl border border-line bg-surface p-6 md:p-10">
    <header className="flex flex-col gap-2">
      <h2 className="headline text-[2.25rem] leading-none text-ink">{title}</h2>
      <p className="text-[1.0625rem] leading-6 text-ink-muted font-stretch-semi-condensed">
        {description}
      </p>
    </header>
    {children}
  </section>
);

export default Section;
