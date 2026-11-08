'use client';

import { WIDGET_KEYS, type WidgetKey } from '@sprintstack/shared/dashboard-widgets';
import { useDashboardContext } from '@sprintstack/shared/providers/main/dashboard';
import Button from '@ui/button';
import Checkbox from '@ui/checkbox';
import Dialog from '@ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const OPTIONS: Record<WidgetKey, { title: string; description: string }> = {
  'next-items': {
    title: 'Your next items',
    description: 'Work assigned to you, soonest due first.',
  },
  activity: {
    title: 'Recent activity',
    description: 'Changes, comments and status moves from your team.',
  },
  burndown: {
    title: 'Burndown',
    description: 'Remaining points in the current sprint, day by day.',
  },
  status: {
    title: 'Work item status',
    description: 'How the sprint’s work splits across statuses.',
  },
};

// A client component because Button takes the icon as a component, which can't cross from the
// server. Widgets already on the dashboard stay listed, ticked and disabled.
const AddWidget = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WidgetKey[]>([]);
  const { widgets, rearrangeWidgets } = useDashboardContext();

  const allAdded = WIDGET_KEYS.every((key) => widgets.includes(key));

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSelected([]);
  };

  const toggle = (key: WidgetKey, checked: boolean) =>
    setSelected((current) => (checked ? [...current, key] : current.filter((k) => k !== key)));

  const addSelected = () => {
    // In catalogue order, whatever order they were ticked in.
    rearrangeWidgets([...widgets, ...WIDGET_KEYS.filter((key) => selected.includes(key))]);
    onOpenChange(false);
  };

  return (
    <>
      <Button icon={PlusIcon} disabled={allAdded} onClick={() => setOpen(true)}>
        Add widget
      </Button>
      <Dialog onOpenChange={onOpenChange} open={open} title="Add widget">
        <p className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
          Select the widgets to add to your dashboard.
        </p>
        <ul className="mt-4 flex flex-col gap-4">
          {WIDGET_KEYS.map((key) => {
            const added = widgets.includes(key);
            return (
              <li key={key}>
                <Checkbox
                  checked={added || selected.includes(key)}
                  disabled={added}
                  onCheckedChange={(checked) => toggle(key, checked)}
                >
                  {OPTIONS[key].title}
                  {added && <span className="text-ink-muted"> (on your dashboard)</span>}
                  <span className="block text-meta text-ink-muted">{OPTIONS[key].description}</span>
                </Checkbox>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={() => onOpenChange(false)} variant="secondary">
            Cancel
          </Button>
          <Button disabled={selected.length === 0} onClick={addSelected}>
            {selected.length > 1 ? `Add ${selected.length} widgets` : 'Add widget'}
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AddWidget;
