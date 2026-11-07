'use client';

import { format } from 'date-fns';
import { useSyncExternalStore } from 'react';

/** Today in the viewer's own time zone, so it's left out of the server render. */
const Today = () => {
  const today = useSyncExternalStore(
    () => () => {},
    () => format(new Date(), 'eeee, d MMMM'),
    () => null,
  );
  // Keeps the line's height while it's empty, so the greeting doesn't shift down.
  return <p className="eyebrow min-h-lh">{today}</p>;
};

export default Today;
