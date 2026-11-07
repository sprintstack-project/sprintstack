import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@ui/button';
import Card from '@ui/card';
import { expect, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `A surface and nothing else: a white sheet with a hairline edge (\`panel\`, the default) or a solid poster tile (\`brand\`, \`ink\`, \`muted\`). Titles, eyebrows, actions and footers are the caller's children. Tiles are a column with a 1rem gap; push content down with a \`flex-1\` spacer. Keep one poster tile per screen.

\`\`\`tsx
import Card from '@ui/card';

<Card>
  <h3 className="headline text-title">Sprint summary</h3>
  <p className="mt-3 text-ink-muted">12 issues, 3 blocked.</p>
</Card>

<Card variant="ink">
  <p className="headline text-poster">Ship it.<br /><em>Sprint 24.</em></p>
</Card>
\`\`\``,
      },
    },
  },
  args: {
    variant: 'panel',
    children: '12 issues, 3 blocked. Ends Friday.',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Card from '@ui/card';

          <Card>12 issues, 3 blocked. Ends Friday.</Card>
        `,
      },
    },
  },
};

const panelSource = code`
  import Button from '@ui/button';
  import Card from '@ui/card';

  // Panel with a header action and a footer
  <Card>
    <header className="flex items-start gap-3">
      <h3 className="headline flex-1 text-title">Sprint summary</h3>
      <Button variant="link">Edit</Button>
    </header>
    <p className="mt-3 text-[1.0625rem] leading-6 font-semibold text-ink-muted">
      12 issues, 3 blocked. Velocity is up 8% on last sprint.
    </p>
    <footer className="mt-4 flex items-center gap-3 border-t border-line-strong pt-4">
      <span className="text-meta font-semibold text-ink-muted">Ends 30 Oct 2026</span>
      <span className="flex-1" />
      <Button variant="primary" size="sm" onClick={closeSprint}>
        Close sprint
      </Button>
    </footer>
  </Card>

  // Poster tiles: keep one per screen
  <Card variant="ink">
    <span className="flex-1" />
    <p className="headline text-poster">
      Ship it.
      <br />
      <em>Sprint 24.</em>
    </p>
  </Card>
  <Card variant="brand">
    <span className="eyebrow text-current">Release notes</span>
    <span className="flex-1" />
    <p className="headline text-headline">v4.2</p>
  </Card>
  <Card variant="muted">
    <span className="eyebrow text-current">Career toolkit</span>
    <span className="flex-1" />
    <p className="headline text-headline">Reviews</p>
  </Card>
`;

export const States: Story = {
  parameters: { docs: { source: { code: panelSource } } },
  render: () => (
    <div className="flex flex-col gap-5">
      <Card>
        <header className="flex items-start gap-3">
          <h3 className="headline flex-1 text-title">Sprint summary</h3>
          <Button variant="link">Edit</Button>
        </header>
        <p className="mt-3 text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
          12 issues, 3 blocked. Velocity is up 8% on last sprint.
        </p>
        <footer className="mt-4 flex items-center gap-3 border-t border-line-strong pt-4">
          <span className="text-meta font-semibold text-ink-muted">Ends 30 Oct 2026</span>
          <span className="flex-1" />
          <Button variant="primary" size="sm">
            Close sprint
          </Button>
        </footer>
      </Card>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        <Card variant="ink">
          <span className="flex-1" />
          <p className="headline text-poster">
            Ship it.
            <br />
            <em>Sprint 24.</em>
          </p>
        </Card>
        <Card variant="brand">
          <span className="eyebrow text-current">Release notes</span>
          <span className="flex-1" />
          <p className="headline text-headline">v4.2</p>
        </Card>
        <Card variant="muted">
          <span className="eyebrow text-current">Career toolkit</span>
          <span className="flex-1" />
          <p className="headline text-headline">Reviews</p>
        </Card>
      </div>
    </div>
  ),
};

/** className merges over the variant's classes, so callers can override them. */
export const ClassName: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { variant: 'muted', className: 'min-h-0 p-4', children: 'Compact tile' },
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByText('Compact tile');
    await expect(card).toHaveClass('min-h-0', 'p-4');
    await expect(card).not.toHaveClass('p-8');
    await expect(card).not.toHaveClass('min-h-50');
  },
};
