import { type ReactNode, Suspense } from 'react';
import WidgetError from './widget-error';

interface SectionProps {
  /** What's loading, for the error message ("Couldn’t load {label}"). */
  label: string;
  /** The skeleton shown until the section's data arrives. */
  fallback: ReactNode;
  children: ReactNode;
}

/** A piece of the dashboard that loads on its own: a skeleton while it waits, an error if it fails. */
const Section = ({ label, fallback, children }: SectionProps) => (
  <WidgetError label={label}>
    <Suspense fallback={fallback}>{children}</Suspense>
  </WidgetError>
);

export default Section;
