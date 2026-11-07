import Text from '@ui/text';
import { format } from 'date-fns';

/** Today, above the greeting. */
export const Today = () => (
  <Text className="text-sm font-bold uppercase text-ink-muted">
    {format(new Date(), 'eeee, d MMMM')}
  </Text>
);
