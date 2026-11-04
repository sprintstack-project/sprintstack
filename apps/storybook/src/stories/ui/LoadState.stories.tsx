import { Button, LoadState, Skeleton } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const meta = {
  title: 'UI/LoadState',
  component: LoadState,
  parameters: {
    docs: {
      description: {
        component: `Wraps the data part of a view while it loads. Keep the chrome (sidebar, page title, tabs, column headers) outside it, so only the data is a skeleton.

- **Wait 300 ms**: nothing shows, so fast loads never flash a skeleton.
- **Hold 500 ms**: once shown, the skeleton stays at least this long, so it doesn't blink.
- **After 8 s**: a slow-load note joins the skeleton.
- **After 30 s, or \`failed\`**: the error panel with Retry. Say what's kept ("Your filters are kept").
- **Announce once**: the container is \`aria-busy\`, \`label\` is announced politely when the skeleton appears, and the blocks are hidden.

\`\`\`tsx
import { LoadState, Skeleton } from '@sprintstack/ui';

<LoadState
  loading={query.isPending}
  failed={query.isError}
  label="Loading backlog…"
  skeleton={<BacklogSkeleton />}
  errorTitle="Couldn’t load the backlog"
  errorDescription="Check your connection and try again. Your filters are kept."
  onRetry={query.refetch}
>
  <Backlog items={query.data} />
</LoadState>
\`\`\``,
      },
    },
  },
  args: {
    loading: true,
    label: 'Loading backlog…',
    skeleton: <Skeleton lines={3} />,
    errorTitle: 'Couldn’t load the backlog',
    errorDescription: 'Check your connection and try again. Your filters are kept.',
  },
} satisfies Meta<typeof LoadState>;

export default meta;
type Story = StoryObj<typeof meta>;

const BacklogSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[70, 50, 60].map((title) => (
      <div key={title} className="flex items-center gap-4 border-b border-line pb-4">
        <Skeleton shape="icon" />
        <Skeleton width={64} />
        <Skeleton width={`${title}%`} />
        <Skeleton shape="pill" width={80} />
      </div>
    ))}
  </div>
);

const Backlog = () => (
  <ul className="flex flex-col gap-4 text-[1.0625rem] font-bold text-ink">
    {['Dark mode for emailed receipts', 'Tidy up onboarding copy', 'Retry failed webhooks'].map(
      (title) => (
        <li key={title} className="border-b border-line pb-4">
          {title}
        </li>
      ),
    )}
  </ul>
);

/** Pick a load to see the timeline. The chrome (title, buttons) stays real throughout. */
const Demo = () => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = (ms: number, fail = false) => {
    clearTimeout(timer.current);
    setFailed(false);
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setFailed(fail);
    }, ms);
  };

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="flex flex-wrap gap-3">
        <Button size="sm" onClick={() => load(200)}>
          Fast (0.2 s)
        </Button>
        <Button size="sm" onClick={() => load(1500)}>
          Normal (1.5 s)
        </Button>
        <Button size="sm" onClick={() => load(10_000)}>
          Slow (10 s)
        </Button>
        <Button size="sm" onClick={() => load(1000, true)}>
          Fails (1 s)
        </Button>
      </div>
      <h2 className="headline text-title text-ink">Backlog</h2>
      <LoadState
        loading={loading}
        failed={failed}
        label="Loading backlog…"
        skeleton={<BacklogSkeleton />}
        slowMessage="Still loading. Large backlogs can take a few seconds."
        errorTitle="Couldn’t load the backlog"
        errorDescription="Check your connection and try again. Your filters are kept."
        errorDetail="Error 503 · ref 7f3k2"
        onRetry={() => load(1500)}
      >
        <Backlog />
      </LoadState>
    </div>
  );
};

export const Playground: Story = { render: () => <Demo /> };

/** Skeleton held open (loading never ends) — after 8 s the slow note appears. */
export const Skeletons: Story = {
  args: {
    skeleton: <BacklogSkeleton />,
    slowMessage: 'Still loading. Large backlogs can take a few seconds.',
  },
};

export const Failed: Story = {
  args: {
    loading: false,
    failed: true,
    errorDetail: 'Error 503 · ref 7f3k2',
    onRetry: () => {},
  },
};

/** A fast load never shows or announces a skeleton; a failed one explains and offers Retry. */
export const Timeline: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await userEvent.click(canvas.getByRole('button', { name: 'Fast (0.2 s)' }));
    await expect(status).toBeEmptyDOMElement();
    await waitFor(() => expect(canvas.getByText('Tidy up onboarding copy')).toBeVisible());
    await expect(status).toBeEmptyDOMElement();

    await userEvent.click(canvas.getByRole('button', { name: 'Fails (1 s)' }));
    await waitFor(() => expect(status).toHaveTextContent('Loading backlog…'));
    const alert = await canvas.findByRole('alert', {}, { timeout: 3000 });
    await expect(alert).toHaveTextContent('Couldn’t load the backlog');

    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(canvas.getByText('Tidy up onboarding copy')).toBeVisible(), {
      timeout: 3000,
    });
  },
};
