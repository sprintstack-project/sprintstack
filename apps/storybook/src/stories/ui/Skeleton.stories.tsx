import { Skeleton } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: `Placeholder blocks in surface-muted with a 1.4 s shimmer (static under reduced motion). Build them at the real component's sizes, so nothing jumps when data lands, and keep chrome (sidebar, page title, tabs, column headers) real: only data is a skeleton.

Blocks are hidden from screen readers. Put them in \`LoadState\`, which waits 300 ms before showing them and announces the load once.

\`\`\`tsx
import { Skeleton } from '@sprintstack/ui';

<Skeleton lines={3} />                 // a paragraph
<Skeleton shape="heading" width={220} />
<Skeleton shape="circle" width={32} />  // avatar
<Skeleton shape="pill" />               // badge or chip
<Skeleton shape="control" size="sm" width={120} />
\`\`\``,
      },
    },
  },
  args: { shape: 'line' },
  argTypes: {
    shape: {
      control: 'select',
      options: ['line', 'heading', 'circle', 'pill', 'control', 'input', 'bar', 'icon'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { width: 320 } };

const Labelled = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3">
    {children}
    <span className="text-meta text-ink-muted">{label}</span>
  </div>
);

export const BuildingBlocks: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <Labelled label="Text line · 14px, radius 8">
        <Skeleton lines={3} />
      </Labelled>
      <Labelled label="Heading · 26px">
        <Skeleton shape="heading" width={220} />
      </Labelled>
      <Labelled label="Avatar · circle">
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" width={32} />
          <Skeleton shape="circle" width={48} />
        </div>
      </Labelled>
      <Labelled label="Badge / chip · pill">
        <div className="flex gap-3">
          <Skeleton shape="pill" width={110} />
          <Skeleton shape="pill" width={80} />
        </div>
      </Labelled>
      <Labelled label="Control · 40–56px pill">
        <Skeleton shape="control" />
      </Labelled>
      <Labelled label="Input · 56px, radius 16">
        <Skeleton shape="input" />
      </Labelled>
      <Labelled label="Bar / progress">
        <Skeleton shape="bar" />
      </Labelled>
      <Labelled label="Icon tile · 24px, radius 8">
        <Skeleton shape="icon" />
      </Labelled>
    </div>
  ),
};

/** Composed at the real sizes: a board card, and table rows under real column headers. */
export const Composed: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-8 lg:grid-cols-[2fr_3fr]">
      <Labelled label="Work item card">
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
          <div className="flex items-center gap-3">
            <Skeleton shape="icon" />
            <Skeleton width={80} />
          </div>
          <Skeleton lines={2} />
          <div className="flex items-center justify-between">
            <Skeleton shape="pill" width={80} />
            <Skeleton shape="circle" width={32} />
          </div>
        </div>
      </Labelled>
      <Labelled label="Table row · real column headers, skeleton cells">
        <div className="rounded-xl border border-line bg-surface px-5">
          <div className="grid grid-cols-[1.5rem_5rem_1fr_7rem_2rem] gap-4 border-b border-line py-3 text-eyebrow text-ink-muted uppercase">
            <span />
            <span>Key</span>
            <span>Title</span>
            <span>Status</span>
            <span />
          </div>
          {[70, 55].map((title, i) => (
            <div
              key={title}
              className={`grid grid-cols-[1.5rem_5rem_1fr_7rem_2rem] items-center gap-4 py-4 ${i ? 'border-t border-line' : ''}`}
            >
              <Skeleton shape="icon" />
              <Skeleton />
              <Skeleton width={`${title}%`} />
              <Skeleton shape="pill" width={110} />
              <Skeleton shape="circle" width={32} />
            </div>
          ))}
        </div>
      </Labelled>
    </div>
  ),
};

/** Blocks are decorative: screen readers skip them. */
export const Hidden: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { lines: 3 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[aria-hidden="true"]');
    await expect(root).not.toBeNull();
  },
};
