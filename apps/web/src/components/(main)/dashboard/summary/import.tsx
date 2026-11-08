'use client';

import Button from '@ui/button';
import Card from '@ui/card';

const Import = () => {
  const onImport = () => {};
  return (
    <Card variant="muted">
      <div className="flex flex-1 flex-col gap-4">
        <span className="eyebrow text-current">Moving from another tool?</span>
        <h2 className="headline text-[3.5rem] leading-[0.92]">Bring your backlog with you</h2>
        <p className="text-body-strong text-ink-muted font-stretch-semi-condensed">
          Import issues, sprints and assignees from a CSV export.
        </p>
        <span className="flex-1" />
        <div>
          <Button onClick={onImport}>Import from CSV</Button>
        </div>
      </div>
    </Card>
  );
};

export default Import;
