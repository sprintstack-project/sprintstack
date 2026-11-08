'use client';

import Button from '@ui/button';
import Dialog from '@ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

// A client component because Button takes the icon as a component, which can't cross from the
// server. Brings back a removed widget; a picker can replace this once there are more.
const AddWidget = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        icon={PlusIcon}
        // disabled={removed.length === 0}
        onClick={() => setOpen(true)}
      >
        Add widget
      </Button>
      <Dialog onOpenChange={setOpen} open={open} title="Add widget">
        <p className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
          Select a widget to add to your dashboard.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} variant="danger">
            Add widget
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AddWidget;
