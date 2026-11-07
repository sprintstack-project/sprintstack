'use client';

import { Button } from '@ui/button';
import { PlusIcon } from 'lucide-react';

// A client component because Button takes the icon as a component, which can't cross from the
// server. Brings back a removed widget; a picker can replace this once there are more.
const AddWidget = () => (
  <Button
    icon={PlusIcon}
    // disabled={removed.length === 0}
    // onClick={() => setWidgets((all) => [...all, removed[0]])}
  >
    Add widget
  </Button>
);

export default AddWidget;
